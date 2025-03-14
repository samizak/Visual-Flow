import { useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import GroupedNode from "./components/GroupedNode";
import SchemaNode from "./components/SchemaNode";
import NodeDataDrawer from "./components/NodeDataDrawer";
import FlowChartDisplay from "./components/FlowChartDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import { useJsonFlowData } from "./hooks/useJsonFlowData";
import { useNodeClickHandler } from "./hooks/useNodeClickHandler";
import { ReactFlowInstance } from "reactflow";

const nodeTypes = {
  grouped: GroupedNode,
  schema: SchemaNode,
};

const proOptions = {
  hideAttribution: true,
};

interface JsonFlowChartProps {
  jsonData: string;
  edgeType: string;
  showGrid?: boolean;
  onNodeCountChange?: (count: number) => void;
  isValidJson: boolean;
  onInit?: (instance: ReactFlowInstance) => void; // Add this line
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
  isValidJson = true,
}: JsonFlowChartProps) {
  const [nodes, setNodes, onNodesChange]: any = useNodesState([]);
  const [edges, setEdges, onEdgesChange]: any = useEdgesState([]);

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

export { JsonFlowChartWithProvider };
