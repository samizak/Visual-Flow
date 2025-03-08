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
  BackgroundVariant,
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
    // Create root node at the center
    const rootId = `node-${nodeId++}`;
    nodes.push({
      id: rootId,
      type: "default",
      data: { label: "Root" },
      position: { x: 50, y: 200 },
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
    // Calculate the size of the JSON structure to determine spacing
    const jsonSize = calculateJsonSize(json);
    const horizontalSpacing = Math.max(250, Math.min(400, 200 + jsonSize * 10));
    const verticalSpacing = Math.max(60, Math.min(150, 50 + jsonSize * 5));
    // Process JSON recursively with dynamic layout
    processObject(json, rootId, 1, 200, horizontalSpacing, verticalSpacing);
    // Helper function to calculate JSON size (depth and breadth)
    function calculateJsonSize(data: any): number {
      if (data === null || typeof data !== "object") {
        return 1;
      }

      if (Array.isArray(data)) {
        if (data.length === 0) return 1;
        return (
          Math.max(...data.map((item) => calculateJsonSize(item))) + data.length
        );
      }

      const keys = Object.keys(data);
      if (keys.length === 0) return 1;

      return (
        Math.max(...keys.map((key) => calculateJsonSize(data[key]))) +
        keys.length
      );
    }
    // Helper function to process objects recursively with dynamic spacing
    function processObject(
      obj: any,
      parentId: string,
      level: number,
      baseYOffset: number,
      hSpacing: number,
      vSpacing: number
    ) {
      const xPos = level * hSpacing;
      let currentYOffset =
        baseYOffset - (Object.keys(obj).length * vSpacing) / 2;

      // Pre-calculate node heights and total height needed
      const nodeInfos = Object.entries(obj).map(([key, value]) => {
        const valueType = getValueType(value);
        const nodeHeight = estimateNodeHeight(value, valueType);
        return { key, value, valueType, nodeHeight };
      });

      // Create nodes with proper spacing
      nodeInfos.forEach((info, index) => {
        const { key, value, valueType, nodeHeight } = info;
        const currentId = `node-${nodeId++}`;

        // Adjust vertical position based on previous nodes
        const yPos = currentYOffset;

        // Create node
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

        // Create edge
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: "default", // Smoother curve
          animated: false,
          style: { strokeWidth: 1.5 },
          sourceHandle: "right",
          targetHandle: "left",
        });

        // Process nested structures with dynamic spacing
        if (valueType === "object" && value !== null) {
          const childCount = Object.keys(value as object).length;
          const childSpacing = childCount > 5 ? vSpacing * 0.8 : vSpacing; // Reduce spacing for large objects
          processObject(
            value,
            currentId,
            level + 1,
            yPos,
            hSpacing,
            childSpacing
          );
          currentYOffset += Math.max(nodeHeight, childCount * childSpacing);
        } else if (valueType === "array") {
          const arrayValue = value as any[];
          const childCount = arrayValue.length;
          const childSpacing = childCount > 5 ? vSpacing * 0.8 : vSpacing; // Reduce spacing for large arrays
          processArray(
            arrayValue,
            currentId,
            level + 1,
            yPos,
            hSpacing,
            childSpacing
          );
          currentYOffset += Math.max(nodeHeight, childCount * childSpacing);
        } else {
          currentYOffset += vSpacing; // Standard spacing for simple values
        }
      });
    }
    // Helper function to estimate node height based on content
    function estimateNodeHeight(value: any, type: string): number {
      if (type === "object" && value !== null) {
        const keys = Object.keys(value as object);
        return Math.max(50, keys.length * 30);
      } else if (type === "array") {
        const arr = value as any[];
        return Math.max(50, arr.length * 30);
      }
      return 50; // Default height for simple values
    }
    // Helper function to process arrays with dynamic spacing
    function processArray(
      arr: any[],
      parentId: string,
      level: number,
      baseYOffset: number,
      hSpacing: number,
      vSpacing: number
    ) {
      const xPos = level * hSpacing;
      let currentYOffset = baseYOffset - (arr.length * vSpacing) / 2;

      // Pre-calculate node heights
      const nodeInfos = arr.map((item, index) => {
        const valueType = getValueType(item);
        const nodeHeight = estimateNodeHeight(item, valueType);
        return { index, item, valueType, nodeHeight };
      });

      // Create nodes with proper spacing
      nodeInfos.forEach((info) => {
        const { index, item, valueType, nodeHeight } = info;
        const currentId = `node-${nodeId++}`;
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
          type: "default", // Smoother curve
          animated: false,
          style: { strokeWidth: 1.5 },
          sourceHandle: "right",
          targetHandle: "left",
        });

        // Process nested structures with dynamic spacing
        if (valueType === "object" && item !== null) {
          const childCount = Object.keys(item as object).length;
          const childSpacing = childCount > 5 ? vSpacing * 0.8 : vSpacing;
          processObject(
            item,
            currentId,
            level + 1,
            yPos,
            hSpacing,
            childSpacing
          );
          currentYOffset += Math.max(nodeHeight, childCount * childSpacing);
        } else if (valueType === "array") {
          const arrayItem = item as any[];
          const childCount = arrayItem.length;
          const childSpacing = childCount > 5 ? vSpacing * 0.8 : vSpacing;
          processArray(
            arrayItem,
            currentId,
            level + 1,
            yPos,
            hSpacing,
            childSpacing
          );
          currentYOffset += Math.max(nodeHeight, childCount * childSpacing);
        } else {
          currentYOffset += vSpacing; // Standard spacing for simple values
        }
      });
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
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{
          type: "default",
          style: { stroke: "#555" },
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-right"
      >
        <Controls />
        <Background
          color="#aaa"
          gap={25}
          variant={BackgroundVariant.Lines}
          style={{ opacity: 0.1 }}
        />
        <Panel position="top-right">
          <div className="bg-[#1e1e1e] p-2 rounded text-white text-xs">
            {/* Legend remains the same */}
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
