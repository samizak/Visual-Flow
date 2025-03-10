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

export default function JsonFlowChart({
  jsonData,
  onNodeCountChange,
  isValidJson = true, // Add this new prop with default value
}: JsonFlowChartProps & { onNodeCountChange?: (count: number) => void } & {
  isValidJson?: boolean; // Make it optional with a default value
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastValidJson, setLastValidJson] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
            convertJsonToGroupedFlow(parsedJson);
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
        // If parsing fails, keep the last valid visualization
        console.log("JSON parsing error (not displayed to user):", error);
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
    [setNodes, setEdges, lastValidJson, onNodeCountChange, isValidJson]
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
  // console.log(nodes);
  // const _nodes = nodes.reduce((acc: any, e: any) => {
  //   acc[e.id] = e.data.label; // Key: id, Value: label
  //   return acc;
  // }, {});

  // const _edges = edges.map((e: any) => [e.id, e.source, e.target]);

  // console.log(_nodes);
  // for (let i = 0; i < edges.length; i++) {
  //   const _key1 = _edges[i][1];
  //   const _key2 = _edges[i][2];
  //   console.log({ from: _nodes[_key1], to: _nodes[_key2] });
  // }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{
          type: "default",
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
