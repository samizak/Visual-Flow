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
  ReactFlowProvider, // Add this import
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { JsonFlowChartProps } from "./types/jsonFlowTypes";
import GroupedNode from "./components/GroupedNode";
import { convertJsonToGroupedFlow } from "./utils/jsonGroupedFlowUtils";

// Define the node types for ReactFlow
const nodeTypes = {
  grouped: GroupedNode,
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
export default function JsonFlowChartWithProvider(props: JsonFlowChartProps & { 
  onNodeCountChange?: (count: number) => void;
  isValidJson?: boolean; 
}) {
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
  const reactFlowInstance = useReactFlow(); // Now this will work correctly
  const prevEdgeTypeRef = useRef(edgeType);

  // Effect to update edge types when edgeType prop changes
  useEffect(() => {
    if (edges.length > 0 && prevEdgeTypeRef.current !== edgeType) {
      // Update all edges with the new edge type
      const updatedEdges = edges.map((edge: any) => {
        return {
          ...edge,
          type: edgeType,
        };
      });

      setEdges(updatedEdges as any);
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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={
          edgeType === "default"
            ? ConnectionLineType.Bezier
            : ConnectionLineType.SmoothStep
        }
        defaultEdgeOptions={{
          type: edgeType,
          style: { stroke: "#555" },
        }}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-right"
        nodesConnectable={false}
        nodesDraggable={true}
        elementsSelectable={false}
        proOptions={proOptions}
        onlyRenderVisibleElements={true}
      >
        <Controls style={controlsStyle} />
        <Background
          color="#aaa"
          gap={25}
          variant={BackgroundVariant.Lines}
          style={{ opacity: 0.1 }}
        />
      </ReactFlow>
    </div>
  );
}
