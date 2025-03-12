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
import FlowChartDisplay from "./components/FlowChartDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import { useJsonFlowData } from "./hooks/useJsonFlowData";
import { useNodeClickHandler } from "./hooks/useNodeClickHandler";

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
  // Explicitly type the nodes and edges state
  const [nodes, setNodes, onNodesChange]: any = useNodesState([]);
  const [edges, setEdges, onEdgesChange]: any = useEdgesState([]);

  // Use our custom hooks for data handling and node click handling
  const { isLoading } = useJsonFlowData({
    jsonData,
    edgeType,
    isValidJson,
    onNodeCountChange,
    setNodes,
    setEdges,
  });

  const {
    onNodeClick,
    drawerOpen,
    setDrawerOpen,
    selectedNodeData,
    selectedNodeLabel,
    nodePath, // Get the nodePath from the hook
  } = useNodeClickHandler({ jsonData });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full w-full">
      <FlowChartDisplay
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        controlsStyle={controlsStyle}
        proOptions={proOptions}
      />

      {/* Node Data Drawer - now with nodePath */}
      <NodeDataDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        nodeData={selectedNodeData}
        nodeLabel={selectedNodeLabel}
        nodePath={nodePath} // Pass the nodePath to the drawer
      />
    </div>
  );
}
