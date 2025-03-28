import { Node, Edge } from "@xyflow/react";

// Add this to your existing types
export interface JsonFlowChartProps {
  jsonData: string;
  onNodeCountChange?: (count: number) => void;
  edgeType?: string;
  showGrid?: boolean; // Add this property
}

export interface FlowChartLegendProps {
  nodeTypes: NodeTypeColors;
}

export interface NodeTypeColors {
  string: string;
  number: string;
  boolean: string;
  object: string;
  array: string;
  null: string;
}

export interface JsonFlowResult {
  nodes: Node[];
  edges: Edge[];
}

export interface NodeInfo {
  key: string;
  value: any;
  valueType: string;
  nodeHeight: number;
}

export interface ArrayNodeInfo {
  index: number;
  item: any;
  valueType: string;
  nodeHeight: number;
}
// Add this interface for the split label
export interface SplitLabel {
  top: string;
  bottom: string;
}

// Update the Node type if needed
export interface CustomNodeData {
  label: SplitLabel;
}
