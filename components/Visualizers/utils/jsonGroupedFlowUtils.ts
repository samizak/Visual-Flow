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
      // Create a unique edge ID by adding a timestamp or random number
      const uniqueEdgeId = `edge-${parentId}-${currentId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      edges.push({
        id: uniqueEdgeId,
        source: parentId,
        target: currentId,
        type: "default",
      });
    }

    // console.log(Object.entries(data));

    if (dataType === "object" && data !== null) {
      // Map properties for display
      // When processing properties in an object
      const properties = Object.entries(data).map(([propKey, propValue]) => {
        const propType = getValueType(propValue);

        // For objects, show the number of keys instead of {...}
        if (propType === "object" && propValue !== null) {
          const keyCount = Object.keys(propValue as any).length;
          return {
            key: propKey,
            value: `{${keyCount} ${keyCount === 1 ? "key" : "keys"}}`,
          };
        }
        // For arrays, show the length and item text
        else if (propType === "array") {
          const arrayLength = (propValue as any[]).length;
          return {
            key: propKey,
            value: `[${arrayLength} ${arrayLength === 1 ? 'item' : 'items'}]`,
          };
        }
        // For primitive types, show the value
        else {
          return {
            key: propKey,
            value: getDisplayValue(propValue, propType),
          };
        }
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

      // Create the node with the non-overlapping position
      nodes.push({
        id: currentId,
        type: "grouped",
        data: {
          label: key || "Value", // Changed from "Root" to "Value" for primitives
          type: dataType,
          properties: [{ key: "", value: getDisplayValue(data, dataType) }], // Fixed properties
          hasChildren: false, // Primitive types don't have children
        },
        position: position, // Fixed variable name
      });
    }
  }

  // console.log(Object.entries(nodes));

  return { nodes, edges };
};
