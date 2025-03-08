import { Node, Edge } from "@xyflow/react";
import { JsonFlowResult } from "../types/jsonFlowTypes";

// Helper function to get the type of a value
export const getValueType = (value: any): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
};

// Helper function to get display value with improved representation
export const getDisplayValue = (value: any, type: string): string => {
  if (type === "object") {
    if (value === null) return "null";
    return "{...}";
  }
  if (type === "array") return `[${value.length}]`;
  if (type === "string") return `"${value}"`;
  if (type === "null") return "null";
  return String(value);
};

// Convert JSON to nodes and edges with grouped properties
export const convertJsonToGroupedFlow = (json: any): JsonFlowResult => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;

  // Create root node at the center
  const rootId = `node-${nodeId++}`;

  // Process the root object
  processJsonNode(json, rootId, null, "", 0, 0);

  // Main function to process JSON nodes recursively
  function processJsonNode(
    data: any,
    currentId: string,
    parentId: string | null,
    key: string,
    xPos: number,
    yPos: number
  ) {
    const dataType = getValueType(data);

    // Connect to parent if it exists
    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
        type: "default",
      });
    }

    if (dataType === "object" && data !== null) {
      // Create object node with properties
      const properties = Object.entries(data).map(([propKey, propValue]) => {
        const propType = getValueType(propValue);
        if (propType === "object" || propType === "array") {
          // For complex types, just show type indicator
          return {
            key: propKey,
            value:
              propType === "object"
                ? "{...}"
                : `[${(propValue as any[]).length}]`,
          };
        } else {
          // For primitive types, show the value
          return {
            key: propKey,
            value: getDisplayValue(propValue, propType),
          };
        }
      });

      // Create the node
      nodes.push({
        id: currentId,
        type: "grouped",
        data: {
          label: key || "Root Object",
          type: "object",
          properties,
        },
        position: { x: xPos, y: yPos },
      });

      // Process child objects and arrays
      let childX = xPos + 300;
      let childY = yPos - (Object.keys(data).length * 100) / 2;

      Object.entries(data).forEach(([childKey, childValue]) => {
        const childType = getValueType(childValue);

        if (childType === "object" && childValue !== null) {
          const childId = `node-${nodeId++}`;
          processJsonNode(
            childValue,
            childId,
            currentId,
            childKey,
            childX,
            childY
          );
          childY += 200;
        } else if (childType === "array") {
          const childId = `node-${nodeId++}`;
          processJsonArray(
            childValue as any,
            childId,
            currentId,
            childKey,
            childX,
            childY
          );
          childY += 200;
        }
      });
    } else if (dataType === "array") {
      // Process array node
      processJsonArray(data, currentId, parentId, key, xPos, yPos);
    } else {
      // This shouldn't happen for the root, but handle primitive types
      nodes.push({
        id: currentId,
        type: "grouped",
        data: {
          label: key || "Value",
          type: dataType,
          properties: [{ key: "", value: getDisplayValue(data, dataType) }],
        },
        position: { x: xPos, y: yPos },
      });
    }
  }

  // Function to process arrays
  function processJsonArray(
    arr: any[],
    currentId: string,
    parentId: string | null,
    key: string,
    xPos: number,
    yPos: number
  ) {
    // Type guard to ensure arr is an array
    if (!Array.isArray(arr)) {
      console.error("Expected array but received:", arr);
      arr = []; // Default to empty array if not an array
    }

    // Connect to parent if it exists
    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
        type: "default",
      });
    }

    // Create array node
    nodes.push({
      id: currentId,
      type: "grouped",
      data: {
        label: `${key || "Array"} [${arr.length}]`,
        type: "array",
        properties: arr.map((item, index) => {
          const itemType = getValueType(item);
          if (itemType === "object" || itemType === "array") {
            return {
              key: `[${index}]`,
              value:
                itemType === "object" ? "{...}" : `[${(item as any[]).length}]`,
            };
          } else {
            return {
              key: `[${index}]`,
              value: getDisplayValue(item, itemType),
            };
          }
        }),
      },
      position: { x: xPos, y: yPos },
    });

    // Process array items that are objects or arrays
    let childX = xPos + 300;
    let childY = yPos - (arr.length * 100) / 2;

    arr.forEach((item, index) => {
      const itemType = getValueType(item);

      if (itemType === "object" && item !== null) {
        const childId = `node-${nodeId++}`;
        processJsonNode(item, childId, currentId, `[${index}]`, childX, childY);
        childY += 200;
      } else if (itemType === "array") {
        const childId = `node-${nodeId++}`;
        processJsonArray(
          item,
          childId,
          currentId,
          `[${index}]`,
          childX,
          childY
        );
        childY += 200;
      }
    });
  }

  return { nodes, edges };
};
