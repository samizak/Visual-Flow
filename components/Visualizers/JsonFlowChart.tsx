import { useCallback, useEffect, useState } from "react";
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

export default function JsonFlowChart({ jsonData }: JsonFlowChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert JSON to nodes and edges
  const processJsonData = useCallback(
    (jsonString: string) => {
      if (!jsonString) {
        setNodes([]);
        setEdges([]);
        setIsLoading(false);
        return;
      }

      try {
        const parsedJson = JSON.parse(jsonString);
        const { nodes: flowNodes, edges: flowEdges } =
          convertJsonToGroupedFlow(parsedJson);
        setNodes(flowNodes as any);
        setEdges(flowEdges as any);
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing JSON:", error);
        setNodes([]);
        setEdges([]);
        setIsLoading(false);
      }
    },
    [setNodes, setEdges]
  );

  // Process JSON data when it changes
  useEffect(() => {
    setIsLoading(true);
    processJsonData(jsonData);
  }, [jsonData, processJsonData]);

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
      >
        <Controls />
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
