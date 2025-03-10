import { Node, Edge } from "@xyflow/react";
import {
  getValueType,
  getDisplayValue,
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_MARGIN,
} from "./jsonUtils";
import { findNonOverlappingPosition } from "./nodePositioning";

// Helper function to create and connect a node
function createAndConnectNode(
  id: string,
  type: string,
  label: string,
  properties: any[],
  position: { x: number; y: number },
  parentId: string | null,
  nodes: Node[],
  edges: Edge[]
) {
  nodes.push({
    id,
    type: "grouped",
    data: {
      label,
      type,
      properties,
    },
    position,
  });

  if (parentId) {
    // Create a unique edge ID by adding a timestamp or random number
    const uniqueEdgeId = `edge-${parentId}-${id}-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    edges.push({
      id: uniqueEdgeId,
      source: parentId,
      target: id,
      type: "default",
    });
  }
}

export function processArrayItems(
  arr: any[],
  parentId: string | null,
  key: string,
  xPos: number,
  yPos: number,
  nodes: Node[],
  edges: Edge[],
  nodeId: number,
  processJsonNode: (
    data: any,
    currentId: string,
    parentId: string | null,
    key: string,
    xPos: number,
    yPos: number
  ) => void
): number {
  // Type guard to ensure arr is an array
  if (!Array.isArray(arr)) {
    console.error("Expected array but received:", arr);
    return nodeId;
  }

  if (arr.length === 0) {
    // If array is empty, create a placeholder node
    const emptyNodeId = `node-${nodeId++}`;
    const position = findNonOverlappingPosition({ x: xPos, y: yPos }, nodes);

    createAndConnectNode(
      emptyNodeId,
      "array",
      `${key} [0]`,
      [{ key: "", value: "Empty array" }],
      position,
      parentId,
      nodes,
      edges
    );

    return nodeId;
  }

  // Calculate vertical distribution
  const totalHeight = arr.length * (NODE_HEIGHT + NODE_MARGIN);
  let childY = yPos - totalHeight / 2 + NODE_HEIGHT / 2;

  arr.forEach((item, index) => {
    const itemType = getValueType(item);
    const childId = `node-${nodeId++}`;
    const position = findNonOverlappingPosition({ x: xPos, y: childY }, nodes);

    if (itemType === "object" && item !== null) {
      // Map object properties for display
      const properties = Object.entries(item).map(
        ([propKey, propValue]: any) => {
          const propType = getValueType(propValue);
          return {
            key: propKey,
            value:
              propType === "object" || propType === "array"
                ? propType === "object"
                  ? propValue === null
                    ? "null"
                    : `{${Object.keys(propValue).length} ${
                        Object.keys(propValue).length === 1 ? "key" : "keys"
                      }}`
                  : `[${(propValue as any[]).length}]`
                : getDisplayValue(propValue, propType),
          };
        }
      );

      createAndConnectNode(
        childId,
        "array",
        `${key} ${index}`,
        properties,
        position,
        parentId,
        nodes,
        edges
      );

      // Process children
      const subChildX = position.x + NODE_WIDTH + NODE_MARGIN;
      const subChildrenCount = Object.keys(item).length;
      const subTotalHeight = subChildrenCount * (NODE_HEIGHT + NODE_MARGIN);
      let subChildY = position.y - subTotalHeight / 2 + NODE_HEIGHT / 2;

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
          nodeId = processArrayItems(
            subChildValue as any[],
            childId,
            subChildKey,
            subChildX,
            subChildY,
            nodes,
            edges,
            nodeId,
            processJsonNode
          );

          // Create the node first with array type
          nodes.push({
            id: childId,
            type: "grouped",
            data: {
              label: `${key} ${index}`,
              type: "array", // Set type to array for all array elements
              properties: Object.entries(item).map(
                ([propKey, propValue]: any) => {
                  const propType = getValueType(propValue);
                  // When displaying array values in the properties
                  if (propType === "object" || propType === "array") {
                    if (propType === "object") {
                      return {
                        key: propKey,
                        value:
                          propValue === null
                            ? "null"
                            : `{${Object.keys(propValue).length} ${
                                Object.keys(propValue).length === 1
                                  ? "key"
                                  : "keys"
                              }}`,
                      };
                    } else {
                      // array
                      const arrayLength = (propValue as any[]).length;
                      return {
                        key: propKey,
                        value: `[${arrayLength} ${
                          arrayLength === 1 ? "item" : "items"
                        }]`,
                      };
                    }
                  }
                }
              ),
              hasChildren: Object.entries(item).some(([_, childValue]) => {
                const childType = getValueType(childValue);
                return (
                  (childType === "object" && childValue !== null) ||
                  childType === "array"
                );
              }),
            },
            position: position, // Fixed: changed nonOverlappingPos to position
          });
          const arrayLength = Math.max(
            1,
            Array.isArray(subChildValue) ? subChildValue.length : 1
          );
          subChildY += NODE_HEIGHT + NODE_MARGIN * arrayLength;
        }
      });
    } else if (itemType === "array") {
      nodeId = processArrayItems(
        item,
        parentId,
        `${key} ${index}`,
        xPos,
        childY,
        nodes,
        edges,
        nodeId,
        processJsonNode
      );
    } else {
      // Handle primitive values
      createAndConnectNode(
        childId,
        "array",
        `${key} ${index}`,
        [{ key: "", value: getDisplayValue(item, itemType) }],
        position,
        parentId,
        nodes,
        edges
      );
    }

    childY += NODE_HEIGHT + NODE_MARGIN;
  });

  return nodeId;
}
