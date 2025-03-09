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
  if (type === "boolean") return String(value); // Ensure booleans are preserved as-is
  if (type === "number") return String(value);  // Ensure numbers are preserved as-is
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
          label: key || "Root",
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
          // Instead of creating an array node, process array items directly
          processArrayItemsDirectly(
            childValue as any[],
            currentId,
            childKey,
            childX,
            childY
          );
          childY += 200 * Math.max(1, (childValue as any[]).length);
        }
      });
    } else if (dataType === "array") {
      // Process array items directly if this is an array node
      processArrayItemsDirectly(data, parentId, key, xPos, yPos);
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
  // New function to process array items directly without creating an array node
  function processArrayItemsDirectly(
    arr: any[],
    parentId: string | null,
    key: string,
    xPos: number,
    yPos: number
  ) {
    // Type guard to ensure arr is an array
    if (!Array.isArray(arr)) {
      console.error("Expected array but received:", arr);
      arr = []; // Default to empty array if not an array
      return;
    }
    if (arr.length === 0) {
      // If array is empty, create a placeholder node
      const emptyNodeId = `node-${nodeId++}`;
      nodes.push({
        id: emptyNodeId,
        type: "grouped",
        data: {
          label: `${key} [0]`,
          type: "array", // Already correct
          properties: [{ key: "", value: "Empty array" }],
        },
        position: { x: xPos, y: yPos },
      });
      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${emptyNodeId}`,
          source: parentId,
          target: emptyNodeId,
          type: "default",
        });
      }
      return;
    }
    // Process array items that are objects or arrays
    let childY = yPos - (arr.length * 100) / 2;
    arr.forEach((item, index) => {
      const itemType = getValueType(item);
      const childId = `node-${nodeId++}`;

      if (itemType === "object" && item !== null) {
        // Create the node first with array type
        nodes.push({
          id: childId,
          type: "grouped",
          data: {
            label: `${key} ${index}`,
            type: "array", // Set type to array for all array elements
            properties: Object.entries(item).map(([propKey, propValue]) => {
              const propType = getValueType(propValue);
              if (propType === "object" || propType === "array") {
                return {
                  key: propKey,
                  value:
                    propType === "object"
                      ? "{...}"
                      : `[${(propValue as any[]).length}]`,
                };
              } else {
                return {
                  key: propKey,
                  value: getDisplayValue(propValue, propType),
                };
              }
            }),
          },
          position: { x: xPos, y: childY },
        });

        // Connect to parent
        if (parentId) {
          edges.push({
            id: `edge-${parentId}-${childId}`,
            source: parentId,
            target: childId,
            type: "default",
          });
        }

        // Process children
        let subChildX = xPos + 300;
        let subChildY = childY - (Object.keys(item).length * 100) / 2;

        Object.entries(item).forEach(([subChildKey, subChildValue]) => {
          const subChildType = getValueType(subChildValue);

          if (subChildType === "object" && subChildValue !== null) {
            const subChildId = `node-${nodeId++}`;
            processJsonNode(
              subChildValue,
              subChildId,
              childId,
              subChildKey,
              subChildX,
              subChildY
            );
            subChildY += 200;
          } else if (subChildType === "array") {
            processArrayItemsDirectly(
              subChildValue as any[],
              childId,
              subChildKey,
              subChildX,
              subChildY
            );
            subChildY += 200 * Math.max(1, (subChildValue as any[]).length);
          }
        });

        childY += 200;
      } else if (itemType === "array") {
        processArrayItemsDirectly(
          item,
          parentId,
          `${key} ${index}`,
          xPos,
          childY
        );
        childY += 200;
      } else {
        // Handle primitive values in arrays
        nodes.push({
          id: childId,
          type: "grouped",
          data: {
            label: `${key} ${index}`,
            type: "array", // Set type to array for all array elements
            properties: [{ key: "", value: getDisplayValue(item, itemType) }],
          },
          position: { x: xPos, y: childY },
        });

        if (parentId) {
          edges.push({
            id: `edge-${parentId}-${childId}`,
            source: parentId,
            target: childId,
            type: "default",
          });
        }

        childY += 200;
      }
    });
  }
  return { nodes, edges };
};
