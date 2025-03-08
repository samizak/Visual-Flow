import { Node, Edge } from "reactflow";

export interface JsonFlowChartProps {
  jsonData: string;
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