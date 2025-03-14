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

// Remove the conflicting import and use only the local interface
// import { JsonFlowChartProps } from "./types/jsonFlowTypes";
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

// Define the interface for the component props
interface JsonFlowChartProps {
  jsonData: string;
  edgeType?: string;
  showGrid?: boolean;
  onNodeCountChange?: (count: number) => void;
  isValidJson?: boolean;
}

// Create a wrapper component that includes the ReactFlowProvider
function JsonFlowChartWithProvider(props: JsonFlowChartProps) {
  return (
    <ReactFlowProvider>
      <JsonFlowChart {...props} />
    </ReactFlowProvider>
  );
}

// The main component
export default function JsonFlowChart({
  jsonData,
  edgeType = "default",
  showGrid = true,
  onNodeCountChange,
  isValidJson = true, // Set default value
}: JsonFlowChartProps) {
  // Explicitly type the nodes and edges state
  const [nodes, setNodes, onNodesChange]: any = useNodesState([]);
  const [edges, setEdges, onEdgesChange]: any = useEdgesState([]);

  // Remove the duplicate isValidJson state declaration
  // const [isValidJson, setIsValidJson] = useState(initialIsValidJson);

  // Use our custom hooks for data handling and node click handling
  const { isLoading } = useJsonFlowData({
    jsonData,
    edgeType,
    isValidJson, // Use the prop directly
    onNodeCountChange,
    setNodes,
    setEdges,
  });

  // Create functions to pass to the hook
  const getNodesFunc = () => nodes;
  const getEdgesFunc = () => edges;

  const {
    onNodeClick,
    drawerOpen,
    setDrawerOpen,
    selectedNodeData,
    selectedNodeLabel,
    nodePath,
  } = useNodeClickHandler({
    jsonData,
    getNodes: getNodesFunc,
    getEdges: getEdgesFunc,
  });

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
        proOptions={proOptions}
        showGrid={showGrid}
      />

      {/* Node Data Drawer */}
      <NodeDataDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        nodeData={selectedNodeData}
        nodeLabel={selectedNodeLabel}
        nodePath={nodePath}
      />
    </div>
  );
}

// Export the provider wrapper for use elsewhere
export { JsonFlowChartWithProvider };
