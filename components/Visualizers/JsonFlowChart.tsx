import { useCallback, useEffect, useState, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { JsonFlowChartProps } from "./types/jsonFlowTypes";
import GroupedNode from "./components/GroupedNode";
import SchemaNode from "./components/SchemaNode";
import { convertJsonToGroupedFlow } from "./utils/jsonGroupedFlowUtils";
import NodeDataDrawer from "./components/NodeDataDrawer";
import { AnyARecord } from "node:dns";

// Define the node types for ReactFlow
const nodeTypes = {
  grouped: GroupedNode,
  schema: SchemaNode,
};

// Define custom styles for controls
const controlsStyle = {
  background: "#1e1e1e",
  borderRadius: "6px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  border: "1px solid #333",
};

const proOptions = {
  hideAttribution: true,
};

// Create a wrapper component that includes the ReactFlowProvider
export default function JsonFlowChartWithProvider(
  props: JsonFlowChartProps & {
    onNodeCountChange?: (count: number) => void;
    isValidJson?: boolean;
  }
) {
  return (
    <ReactFlowProvider>
      <JsonFlowChart {...props} />
    </ReactFlowProvider>
  );
}

// The actual component implementation
function JsonFlowChart({
  jsonData,
  onNodeCountChange,
  isValidJson = true,
  edgeType = "smoothstep",
}: JsonFlowChartProps & { onNodeCountChange?: (count: number) => void } & {
  isValidJson?: boolean;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastValidJson, setLastValidJson] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reactFlowInstance = useReactFlow();
  const prevEdgeTypeRef = useRef(edgeType);

  // State for the drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<Record<string, any>>(
    {}
  );
  const [selectedNodeLabel, setSelectedNodeLabel] = useState("");

  // Effect to update edge types when edgeType prop changes
  useEffect(() => {
    if (edges.length > 0 && prevEdgeTypeRef.current !== edgeType) {
      // Update all edges with the new edge type
      const updatedEdges: any = edges.map((edge: any) => ({
        ...edge,
        type: edgeType,
      }));

      setEdges(updatedEdges);
      prevEdgeTypeRef.current = edgeType;
    }
  }, [edgeType, edges, setEdges]);

  // Convert JSON to nodes and edges
  const processJsonData = useCallback(
    (jsonString: string) => {
      if (!jsonString) {
        setNodes([]);
        setEdges([]);
        setIsLoading(false);
        onNodeCountChange?.(0);
        return;
      }

      try {
        // Only attempt to parse and update if the JSON is valid
        if (isValidJson) {
          const parsedJson = JSON.parse(jsonString);
          const { nodes: flowNodes, edges: flowEdges } =
            convertJsonToGroupedFlow(parsedJson, edgeType);
          setNodes(flowNodes as any);
          setEdges(flowEdges as any);
          setLastValidJson(jsonString);
          setIsLoading(false);
          onNodeCountChange?.(flowNodes.length);
        } else {
          // If JSON is invalid but we have a previous visualization,
          // just keep the current state and stop loading
          setIsLoading(false);
        }
      } catch (error) {
        if (lastValidJson) {
          // Don't update the visualization if we have a previous valid state
          setIsLoading(false);
        } else {
          // If there's no previous valid state, show empty diagram
          setNodes([]);
          setEdges([]);
          setIsLoading(false);
          onNodeCountChange?.(0);
        }
      }
    },
    [
      edgeType,
      setNodes,
      setEdges,
      onNodeCountChange,
      isValidJson,
      lastValidJson,
    ]
  );

  // Handle node click to show drawer
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.data.label === "Root" && jsonData) {
        try {
          const parsedJson = JSON.parse(jsonData);
          setSelectedNodeData(parsedJson);
          setSelectedNodeLabel("Root");
          setDrawerOpen(true);
          return;
        } catch (error) {
          console.error("Error parsing root JSON:", error);
        }
      }

      try {
        const parsedJson = JSON.parse(jsonData);
        const nodeData: any = node.data;

        // Check if this is an array item node (label format: "arrayName > index")
        if (nodeData.label && nodeData.label.includes(" > ")) {
          const parts = nodeData.label.split(" > ");
          const arrayName = parts[0];
          const indexPath = parts.slice(1);

          // Handle nested array indices (e.g., "products > 1 > num > 3")
          let currentValue = parsedJson;
          let currentPath = arrayName;

          // First get to the array
          if (arrayName in parsedJson) {
            currentValue = parsedJson[arrayName];
          } else {
            // If direct access fails, try to find the array using a recursive search
            const findInObject = (obj: any, key: string): any => {
              if (!obj || typeof obj !== "object") return undefined;

              if (key in obj) return obj[key];

              for (const prop in obj) {
                const value = obj[prop];
                if (typeof value === "object") {
                  const found = findInObject(value, key);
                  if (found !== undefined) return found;
                }
              }

              return undefined;
            };

            currentValue = findInObject(parsedJson, arrayName);
            if (currentValue === undefined) {
              throw new Error(`Could not find array: ${arrayName}`);
            }
          }

          // Then navigate through the indices
          for (const indexStr of indexPath) {
            // Handle both numeric indices and property names
            const index = parseInt(indexStr, 10);

            if (!isNaN(index)) {
              // It's a numeric index
              if (Array.isArray(currentValue) && index < currentValue.length) {
                currentValue = currentValue[index];
              } else if (
                typeof currentValue === "object" &&
                currentValue !== null &&
                index in currentValue
              ) {
                // Some objects might have numeric keys
                currentValue = currentValue[index];
              } else {
                throw new Error(
                  `Invalid array index: ${indexStr} in path: ${currentPath}`
                );
              }
            } else {
              // It's a property name
              if (
                typeof currentValue === "object" &&
                currentValue !== null &&
                indexStr in currentValue
              ) {
                currentValue = currentValue[indexStr];
              } else {
                throw new Error(
                  `Invalid property: ${indexStr} in path: ${currentPath}`
                );
              }
            }

            currentPath += ` > ${indexStr}`;
          }

          // Create a wrapper object with the appropriate key
          // For array items, use the full path as the label for clarity
          const displayData = { [arrayName]: currentValue };
          setSelectedNodeData(displayData);
          setSelectedNodeLabel(nodeData.label);
          setDrawerOpen(true);
          return;
        }

        // For non-array nodes, use the existing logic
        let nodeKey = nodeData.label;

        // Find the node's value in the original JSON
        const findNodeValue = (obj: any, key: string): any => {
          // Direct property match
          if (obj && typeof obj === "object" && key in obj) {
            return obj[key];
          }

          // Search in nested objects and arrays
          if (obj && typeof obj === "object") {
            for (const prop in obj) {
              const value = obj[prop];

              // If this property matches our key, return its value
              if (prop === key) {
                return value;
              }

              // If this is an object or array, search inside it
              if (value && typeof value === "object") {
                const found = findNodeValue(value, key);
                if (found !== undefined) {
                  return found;
                }
              }
            }
          }

          return undefined;
        };

        // Get the node value
        const nodeValue = findNodeValue(parsedJson, nodeKey);

        if (nodeValue !== undefined) {
          const displayData = { [nodeKey]: nodeValue };
          setSelectedNodeData(displayData);
          setSelectedNodeLabel(nodeData.label || "Node");
          setDrawerOpen(true);
        } else {
          console.error("Could not find node value for key:", nodeKey);
          setSelectedNodeData({ [nodeKey]: "Could not find data" });
          setSelectedNodeLabel(nodeData.label || "Node");
          setDrawerOpen(true);
        }
      } catch (error) {
        console.error("Error processing node data:", error);

        const nodeData: any = node.data;
        let cleanLabel = nodeData.label || "Node";
        if (cleanLabel.includes(" > ")) {
          cleanLabel = cleanLabel.split(" > ")[0];
        }

        setSelectedNodeData({ [cleanLabel]: "Error retrieving data" });
        setSelectedNodeLabel(nodeData.label || "Node");
        setDrawerOpen(true);
      }
    },
    [jsonData]
  );

  // Process JSON data with debounce
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only show loading state if we're going from valid to new state
    // and the JSON is valid
    if (lastValidJson !== jsonData && !isLoading && isValidJson) {
      setIsLoading(true);
    }

    // Set a new timer to process the JSON after a delay
    debounceTimerRef.current = setTimeout(() => {
      processJsonData(jsonData);
    }, 800); // 800ms debounce time

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [jsonData, processJsonData, lastValidJson, isLoading, isValidJson]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-gray-400">Loading visualization...</div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          proOptions={proOptions}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Controls style={controlsStyle} />
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            color="#333"
          />
        </ReactFlow>
      )}

      {/* Node Data Drawer */}
      <NodeDataDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        nodeData={selectedNodeData}
        nodeLabel={selectedNodeLabel}
      />
    </div>
  );
}
