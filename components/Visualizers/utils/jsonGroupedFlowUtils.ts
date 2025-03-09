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
  if (type === "number") return String(value); // Ensure numbers are preserved as-is
  if (type === "null") return "null";
  return String(value);
};

// Constants for node dimensions and spacing
const NODE_WIDTH = 250; // Reduced from 300
const NODE_HEIGHT = 150; // Reduced from 200
const NODE_MARGIN = 30; // Reduced from 50

// Helper function to check if two nodes overlap
function doNodesOverlap(
  node1Pos: { x: number; y: number },
  node2Pos: { x: number; y: number }
): boolean {
  return (
    Math.abs(node1Pos.x - node2Pos.x) < NODE_WIDTH + NODE_MARGIN &&
    Math.abs(node1Pos.y - node2Pos.y) < NODE_HEIGHT + NODE_MARGIN
  );
}

// Helper function to find a position where a node doesn't overlap with existing nodes
function findNonOverlappingPosition(
  newPos: { x: number; y: number },
  existingNodes: Node[]
): { x: number; y: number } {
  let position = { ...newPos };
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  while (attempts < maxAttempts) {
    let hasOverlap = false;

    for (const node of existingNodes) {
      if (doNodesOverlap(position, node.position)) {
        hasOverlap = true;
        // Try moving the node down
        position.y += NODE_HEIGHT + NODE_MARGIN;
        break;
      }
    }

    if (!hasOverlap) {
      return position;
    }

    attempts++;
  }

  // If we couldn't find a non-overlapping position, offset it diagonally
  return {
    x: newPos.x + attempts * 50,
    y: newPos.y + attempts * 50,
  };
}

// Convert JSON to nodes and edges with grouped properties
export const convertJsonToGroupedFlow = (json: any): JsonFlowResult => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;

  // Create root node at the center
  const rootId = `node-${nodeId++}`;

  // Process the root object - place at (0,0) as the center point
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

      // Find non-overlapping position before creating the node
      const nonOverlappingPos = findNonOverlappingPosition(
        { x: xPos, y: yPos },
        nodes
      );

      // Create the node with the non-overlapping position
      nodes.push({
        id: currentId,
        type: "grouped",
        data: {
          label: key || "Root",
          type: "object",
          properties,
        },
        position: nonOverlappingPos,
      });

      // Update the child positioning logic - always branch to the right
      let childX = nonOverlappingPos.x + NODE_WIDTH + NODE_MARGIN;

      // Calculate total children to distribute vertically
      const childrenCount = Object.keys(data).length;
      const totalHeight = childrenCount * (NODE_HEIGHT + NODE_MARGIN);

      // Start from the top of the distribution area
      let childY = nonOverlappingPos.y - totalHeight / 2 + NODE_HEIGHT / 2;

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
          childY += NODE_HEIGHT + NODE_MARGIN;
        } else if (childType === "array") {
          // Instead of creating an array node, process array items directly
          processArrayItemsDirectly(
            childValue as any[],
            currentId,
            childKey,
            childX,
            childY
          );

          // Adjust the vertical position based on array length
          const arrayLength = Array.isArray(childValue) ? childValue.length : 1;
          childY += NODE_HEIGHT + NODE_MARGIN * Math.max(1, arrayLength);
        }
      });
    } else if (dataType === "array") {
      // Process array items directly if this is an array node
      processArrayItemsDirectly(data, parentId, key, xPos, yPos);
    } else {
      // This shouldn't happen for the root, but handle primitive types
      const nonOverlappingPos = findNonOverlappingPosition(
        { x: xPos, y: yPos },
        nodes
      );

      nodes.push({
        id: currentId,
        type: "grouped",
        data: {
          label: key || "Value",
          type: dataType,
          properties: [{ key: "", value: getDisplayValue(data, dataType) }],
        },
        position: nonOverlappingPos,
      });
    }
  }

  // Function to process array items directly
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
      const nonOverlappingPos = findNonOverlappingPosition(
        { x: xPos, y: yPos },
        nodes
      );

      nodes.push({
        id: emptyNodeId,
        type: "grouped",
        data: {
          label: `${key} [0]`,
          type: "array", // Already correct
          properties: [{ key: "", value: "Empty array" }],
        },
        position: nonOverlappingPos,
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

    // Calculate total height needed for array items
    const totalHeight = arr.length * (NODE_HEIGHT + NODE_MARGIN);

    // Start from the top of the distribution area
    let childY = yPos - totalHeight / 2 + NODE_HEIGHT / 2;

    arr.forEach((item, index) => {
      const itemType = getValueType(item);
      const childId = `node-${nodeId++}`;
      const nonOverlappingPos = findNonOverlappingPosition(
        { x: xPos, y: childY },
        nodes
      );

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
          position: nonOverlappingPos,
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

        // Process children - always branch to the right
        let subChildX = nonOverlappingPos.x + NODE_WIDTH + NODE_MARGIN;

        // Calculate total height for sub-children
        const subChildrenCount = Object.keys(item).length;
        const subTotalHeight = subChildrenCount * (NODE_HEIGHT + NODE_MARGIN);

        // Start from the top of the distribution area
        let subChildY =
          nonOverlappingPos.y - subTotalHeight / 2 + NODE_HEIGHT / 2;

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
            subChildY += NODE_HEIGHT + NODE_MARGIN;
          } else if (subChildType === "array") {
            processArrayItemsDirectly(
              subChildValue as any[],
              childId,
              subChildKey,
              subChildX,
              subChildY
            );

            // Adjust the vertical position based on array length
            const arrayLength = Array.isArray(subChildValue)
              ? subChildValue.length
              : 1;
            subChildY += NODE_HEIGHT + NODE_MARGIN * Math.max(1, arrayLength);
          }
        });

        childY += NODE_HEIGHT + NODE_MARGIN;
      } else if (itemType === "array") {
        processArrayItemsDirectly(
          item,
          parentId,
          `${key} ${index}`,
          xPos,
          childY
        );
        childY += NODE_HEIGHT + NODE_MARGIN;
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
          position: nonOverlappingPos,
        });

        if (parentId) {
          edges.push({
            id: `edge-${parentId}-${childId}`,
            source: parentId,
            target: childId,
            type: "default",
          });
        }

        childY += NODE_HEIGHT + NODE_MARGIN;
      }
    });
  }

  return { nodes, edges };
};
