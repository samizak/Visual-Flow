import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node types will be defined here later

// Define node types and their colors
const nodeTypes = {
  string: "#4caf50", // Green
  number: "#2196f3", // Blue
  boolean: "#ff9800", // Orange
  object: "#9c27b0", // Purple
  array: "#e91e63", // Pink
  null: "#607d8b", // Gray
};

interface JsonFlowChartProps {
  jsonData: string;
}

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
        const { nodes, edges } = convertJsonToFlow(parsedJson);

        setNodes(nodes);
        setEdges(edges);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing JSON:", error);
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
  // Convert JSON to nodes and edges
  const convertJsonToFlow = (json: any) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;
    // Create root node at the left side
    const rootId = `node-${nodeId++}`;
    nodes.push({
      id: rootId,
      type: "default",
      data: { label: "Root" },
      position: { x: 50, y: 0 },
      style: {
        background: nodeTypes.object,
        color: "white",
        border: "1px solid #222",
        borderRadius: "5px",
        padding: "10px",
      },
      sourcePosition: "right" as any,
      targetPosition: "left" as any,
    });
    // Process JSON recursively with improved layout
    const totalHeight = processObject(json, rootId, 1, 0);
    // Helper function to process objects recursively
    function processObject(
      obj: any,
      parentId: string,
      level: number,
      yOffset: number
    ) {
      let xPos = level * 300; // Horizontal spacing
      let currentYOffset = yOffset;
      let totalHeight = 0;
      // First pass - calculate heights
      const itemHeights: number[] = [];
      Object.entries(obj).forEach(([key, value], index) => {
        const valueType = getValueType(value);
        let itemHeight = 50; // Base height for a node

        if (valueType === "object" && value !== null) {
          // For objects, calculate nested height
          const objKeys = Object.keys(value as object).length;
          itemHeight =
            objKeys > 0 ? processObjectHeight(value as object) : itemHeight;
        } else if (valueType === "array") {
          // For arrays, calculate nested height
          const arrayValue = value as any[];
          itemHeight =
            arrayValue.length > 0 ? processArrayHeight(arrayValue) : itemHeight;
        }

        itemHeights.push(itemHeight);
      });
      // Second pass - create nodes with proper spacing
      Object.entries(obj).forEach(([key, value], index) => {
        const currentId = `node-${nodeId++}`;
        const valueType = getValueType(value);
        // Calculate position with proper spacing
        const yPos = currentYOffset;
        // Create node for key
        nodes.push({
          id: currentId,
          type: "default",
          data: { label: `${key}: ${getDisplayValue(value, valueType)}` },
          position: { x: xPos, y: yPos },
          style: {
            background: nodeTypes[valueType as keyof typeof nodeTypes],
            color: "white",
            border: "1px solid #222",
            borderRadius: "5px",
            padding: "10px",
          },
          sourcePosition: "right" as any,
          targetPosition: "left" as any,
        });
        // Create edge from parent to this node
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: "smoothstep",
          animated: false,
          sourceHandle: "right",
          targetHandle: "left",
        });
        // Process nested structures
        if (valueType === "object" && value !== null) {
          const nestedHeight = processObject(value, currentId, level + 1, yPos);
          currentYOffset += Math.max(nestedHeight, 80);
        } else if (valueType === "array") {
          const nestedHeight = processArray(
            value as any[],
            currentId,
            level + 1,
            yPos
          );
          currentYOffset += Math.max(nestedHeight, 80);
        } else {
          currentYOffset += 80; // Standard spacing for simple values
        }
        totalHeight = currentYOffset - yOffset;
      });
      return totalHeight || 50; // Return at least 50px height
    }
    // Helper function to calculate object height
    function processObjectHeight(obj: any): number {
      if (Object.keys(obj).length === 0) return 50;
      let height = 0;
      Object.entries(obj).forEach(([key, value]) => {
        const valueType = getValueType(value);
        if (valueType === "object" && value !== null) {
          height += processObjectHeight(value);
        } else if (valueType === "array") {
          height += processArrayHeight(value as any);
        } else {
          height += 80;
        }
      });
      return Math.max(height, 50);
    }
    // Helper function to calculate array height
    function processArrayHeight(arr: any[]): number {
      if (arr.length === 0) return 50;
      let height = 0;
      arr.forEach((item) => {
        const valueType = getValueType(item);
        if (valueType === "object" && item !== null) {
          height += processObjectHeight(item);
        } else if (valueType === "array") {
          height += processArrayHeight(item);
        } else {
          height += 80;
        }
      });
      return Math.max(height, 50);
    }
    // Helper function to process arrays with improved layout
    function processArray(
      arr: any[],
      parentId: string,
      level: number,
      yOffset: number
    ) {
      let xPos = level * 300;
      let currentYOffset = yOffset;
      let totalHeight = 0;
      arr.forEach((item, index) => {
        const currentId = `node-${nodeId++}`;
        const valueType = getValueType(item);
        const yPos = currentYOffset;
        nodes.push({
          id: currentId,
          type: "default",
          data: { label: `[${index}]: ${getDisplayValue(item, valueType)}` },
          position: { x: xPos, y: yPos },
          style: {
            background: nodeTypes[valueType as keyof typeof nodeTypes],
            color: "white",
            border: "1px solid #222",
            borderRadius: "5px",
            padding: "10px",
          },
          sourcePosition: "right" as any,
          targetPosition: "left" as any,
        });
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: "smoothstep",
          animated: false,
          sourceHandle: "right",
          targetHandle: "left",
        });
        // Process nested structures
        if (valueType === "object" && item !== null) {
          const nestedHeight = processObject(item, currentId, level + 1, yPos);
          currentYOffset += Math.max(nestedHeight, 80);
        } else if (valueType === "array") {
          const nestedHeight = processArray(item, currentId, level + 1, yPos);
          currentYOffset += Math.max(nestedHeight, 80);
        } else {
          currentYOffset += 80; // Standard spacing for simple values
        }
        totalHeight = currentYOffset - yOffset;
      });
      return totalHeight || 50; // Return at least 50px height
    }
    return { nodes, edges };
  };
  // Helper function to get the type of a value
  const getValueType = (value: any): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };
  // Helper function to get display value
  const getDisplayValue = (value: any, type: string): string => {
    if (type === "object") return "{...}";
    if (type === "array") return `[${value.length}]`;
    if (type === "string") return `"${value}"`;
    if (type === "null") return "null";
    return String(value);
  };
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
        <Panel position="top-right">
          <div className="bg-[#1e1e1e] p-2 rounded text-white text-xs">
            <div className="flex items-center mb-1">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: nodeTypes.string }}
              ></div>
              <span>String</span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: nodeTypes.number }}
              ></div>
              <span>Number</span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: nodeTypes.boolean }}
              ></div>
              <span>Boolean</span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: nodeTypes.object }}
              ></div>
              <span>Object</span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: nodeTypes.array }}
              ></div>
              <span>Array</span>
            </div>
            <div className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: nodeTypes.null }}
              ></div>
              <span>Null</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
