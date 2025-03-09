import { Node, Edge } from "@xyflow/react";
import { JsonFlowResult } from "../types/jsonFlowTypes";
import {
  getValueType,
  getDisplayValue,
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_MARGIN,
} from "./jsonUtils";
import { findNonOverlappingPosition } from "./nodePositioning";
import { processArrayItems } from "./arrayProcessor";

// Helper function to create a node
function createNode(
  id: string,
  type: string,
  label: string,
  properties: any[],
  position: { x: number; y: number }
): Node {
  return {
    id,
    type: "grouped",
    data: {
      label,
      type,
      properties,
    },
    position,
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
      // Map properties for display
      const properties = Object.entries(data).map(([propKey, propValue]) => {
        const propType = getValueType(propValue);
        return {
          key: propKey,
          value:
            propType === "object" || propType === "array"
              ? propType === "object"
                ? "{...}"
                : `[${(propValue as any[]).length}]`
              : getDisplayValue(propValue, propType),
        };
      });

      // Find non-overlapping position
      const position = findNonOverlappingPosition({ x: xPos, y: yPos }, nodes);

      // Create the node
      nodes.push(
        createNode(currentId, "object", key || "Root", properties, position)
      );

      // Process children
      const childX = position.x + NODE_WIDTH + NODE_MARGIN;
      const childrenCount = Object.keys(data).length;
      const totalHeight = childrenCount * (NODE_HEIGHT + NODE_MARGIN);
      let childY = position.y - totalHeight / 2 + NODE_HEIGHT / 2;

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
          nodeId = processArrayItems(
            childValue as any[],
            currentId,
            childKey,
            childX,
            childY,
            nodes,
            edges,
            nodeId,
            processJsonNode
          );

          const arrayLength = Math.max(
            1,
            Array.isArray(childValue) ? childValue.length : 1
          );
          childY += NODE_HEIGHT + NODE_MARGIN * arrayLength;
        }
      });
    } else if (dataType === "array") {
      // Process array items directly
      nodeId = processArrayItems(
        data,
        parentId,
        key,
        xPos,
        yPos,
        nodes,
        edges,
        nodeId,
        processJsonNode
      );
    } else {
      // Handle primitive types
      const position = findNonOverlappingPosition({ x: xPos, y: yPos }, nodes);

      nodes.push(
        createNode(
          currentId,
          dataType,
          key || "Value",
          [{ key: "", value: getDisplayValue(data, dataType) }],
          position
        )
      );
    }
  }

  return { nodes, edges };
};
