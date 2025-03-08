import { Node, Edge } from "reactflow";
import { JsonFlowResult, NodeTypeColors } from "../types/jsonFlowTypes";
import {
  getValueType,
  getDisplayValue,
  isArrayOfObjects,
  getObjectName,
} from "./typeUtils";
import { createNode, createEdge, estimateNodeHeight } from "./nodeUtils";
import { calculateJsonSize, calculateSpacing } from "./layoutUtils";

// Define node types and their colors
export const nodeTypes: NodeTypeColors = {
  string: "#4caf50", // Green
  number: "#2196f3", // Blue
  boolean: "#ff9800", // Orange
  object: "#9c27b0", // Purple
  array: "#e91e63", // Pink
  null: "#607d8b", // Gray
};

// Convert JSON to nodes and edges
export const convertJsonToFlow = (json: any): JsonFlowResult => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;

  // Create root node at the center
  const rootId = `node-${nodeId++}`;
  nodes.push(
    createNode(rootId, { top: "Root", bottom: "Object" }, 50, 200, "object")
  );

  // Calculate the size of the JSON structure to determine spacing
  const jsonSize = calculateJsonSize(json);
  const { horizontalSpacing, verticalSpacing } = calculateSpacing(jsonSize);

  // Process JSON recursively with dynamic layout
  processObject(json, rootId, 1, 200, horizontalSpacing, verticalSpacing);

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
    let currentYOffset = baseYOffset - (Object.keys(obj).length * vSpacing) / 2;

    // Pre-calculate node heights and total height needed
    const nodeInfos = Object.entries(obj).map(([key, value]) => {
      const valueType = getValueType(value);
      const nodeHeight = estimateNodeHeight(value, valueType);
      return { key, value, valueType, nodeHeight };
    });

    // Create nodes with proper spacing
    nodeInfos.forEach((info) => {
      const { key, value, valueType, nodeHeight }: any = info;
      const currentId = `node-${nodeId++}`;
      const yPos = currentYOffset;

      // Check if this is an array of objects - special handling
      if (valueType === "array" && isArrayOfObjects(value)) {
        // Create a node for the array property
        nodes.push(
          createNode(
            currentId,
            {
              top: `${key} [${value.length}]`,
              bottom: valueType.charAt(0).toUpperCase() + valueType.slice(1),
            },
            xPos,
            yPos,
            valueType
          )
        );

        // Connect to parent
        edges.push(
          createEdge(`edge-${parentId}-${currentId}`, parentId, currentId)
        );

        // Process array items directly
        processArrayOfObjects(
          value,
          currentId,
          level + 1,
          yPos,
          hSpacing,
          vSpacing
        );

        currentYOffset += Math.max(nodeHeight, value.length * vSpacing);
      } else {
        // Standard node creation for non-arrays or arrays of primitives
        nodes.push(
          createNode(
            currentId,
            {
              top: `${key}: ${getDisplayValue(value, valueType)}`,
              bottom: valueType.charAt(0).toUpperCase() + valueType.slice(1),
            },
            xPos,
            yPos,
            valueType
          )
        );

        // Connect to parent
        edges.push(
          createEdge(`edge-${parentId}-${currentId}`, parentId, currentId)
        );

        // Process nested structures
        if (valueType === "object" && value !== null) {
          const childCount = Object.keys(value as object).length;
          const childSpacing = childCount > 5 ? vSpacing * 0.8 : vSpacing;
          processObject(
            value,
            currentId,
            level + 1,
            yPos,
            hSpacing,
            childSpacing
          );
          currentYOffset += Math.max(nodeHeight, childCount * childSpacing);
        } else if (valueType === "array" && !isArrayOfObjects(value)) {
          const arrayValue = value as any[];
          const childCount = arrayValue.length;
          const childSpacing = childCount > 5 ? vSpacing * 0.8 : vSpacing;
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
      }
    });
  }

  // Helper function to process arrays of objects directly
  function processArrayOfObjects(
    arr: any[],
    parentId: string,
    level: number,
    baseYOffset: number,
    hSpacing: number,
    vSpacing: number
  ) {
    const xPos = level * hSpacing;
    let currentYOffset = baseYOffset - (arr.length * vSpacing) / 2;

    // Get the array name from the parent node
    const parentNode = nodes.find((node) => node.id === parentId);
    const arrayName = parentNode ? parentNode.data.label.split(" [")[0] : "";

    // Process each object in the array
    arr.forEach((item, index) => {
      if (typeof item === "object" && item !== null) {
        const currentId = `node-${nodeId++}`;
        const yPos = currentYOffset;

        // Get a meaningful name for the item using array name and index
        const itemName = `${arrayName} ${index}`;

        // Create node for the array item
        nodes.push(
          createNode(
            currentId,
            {
              top: itemName,
              bottom: "Object",
            },
            xPos,
            yPos,
            "object"
          )
        );

        // Connect to parent array
        edges.push(
          createEdge(`edge-${parentId}-${currentId}`, parentId, currentId)
        );

        // Process the object's properties
        const childCount = Object.keys(item).length;
        const childSpacing = childCount > 5 ? vSpacing * 0.8 : vSpacing;
        processObject(item, currentId, level + 1, yPos, hSpacing, childSpacing);

        // Update vertical position for next item
        const nodeHeight = estimateNodeHeight(item, "object");
        currentYOffset += Math.max(nodeHeight, childCount * childSpacing);
      }
    });
  }

  // Helper function to process arrays with dynamic spacing (for non-object arrays)
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

      nodes.push(
        createNode(
          currentId,
          {
            top: `[${index}]: ${getDisplayValue(item, valueType)}`,
            bottom: valueType.charAt(0).toUpperCase() + valueType.slice(1)
          },
          xPos,
          yPos,
          valueType
        )
      );

      edges.push(
        createEdge(`edge-${parentId}-${currentId}`, parentId, currentId)
      );

      // Process nested structures with dynamic spacing
      if (valueType === "object" && item !== null) {
        const childCount = Object.keys(item as object).length;
        const childSpacing = childCount > 5 ? vSpacing * 0.8 : vSpacing;
        processObject(item, currentId, level + 1, yPos, hSpacing, childSpacing);
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
