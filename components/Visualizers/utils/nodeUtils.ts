import { Node, Edge } from "reactflow";
import { nodeTypes } from "./typeUtils";

// Create a node style based on type
export const createNodeStyle = (type: string) => ({
  background: nodeTypes[type as keyof typeof nodeTypes],
  color: "white",
  border: "1px solid #222",
  borderRadius: "5px",
  fontSize: "20px",
  padding: "10px",
  fontWeight: 500,
});

// Create a node with standard properties
export const createNode = (
  id: string,
  label: { top: string; bottom: string },
  x: number,
  y: number,
  type: string
): Node => ({
  id,
  type: "default",
  data: { label },
  position: { x, y },
  style: createNodeStyle(type),
  sourcePosition: "right" as any,
  targetPosition: "left" as any,
});

// Create an edge between nodes
export const createEdge = (
  id: string,
  source: string,
  target: string
): Edge => ({
  id,
  source,
  target,
  type: "default",
  animated: false,
  style: { strokeWidth: 1.5 },
  sourceHandle: "right",
  targetHandle: "left",
});

// Helper function to estimate node height based on content
export const estimateNodeHeight = (value: any, type: string): number => {
  if (type === "object" && value !== null) {
    const keys = Object.keys(value as object);
    return Math.max(60, keys.length * 30);
  } else if (type === "array") {
    const arr = value as any[];
    return Math.max(60, arr.length * 30);
  }
  return 60; // Default height for simple values
};
