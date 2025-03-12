import React from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  ProOptions
} from '@xyflow/react';

interface FlowChartDisplayProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  nodeTypes: Record<string, React.ComponentType<any>>;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  controlsStyle: React.CSSProperties;
  proOptions: ProOptions;
}

const FlowChartDisplay: React.FC<FlowChartDisplayProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  nodeTypes,
  onNodeClick,
  controlsStyle,
  proOptions
}) => {
  return (
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
  );
};

export default FlowChartDisplay;