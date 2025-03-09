import { Node } from "@xyflow/react";
import { NODE_WIDTH, NODE_HEIGHT, NODE_MARGIN } from "./jsonUtils";

// Helper function to check if two nodes overlap
export function doNodesOverlap(
  node1Pos: { x: number; y: number },
  node2Pos: { x: number; y: number }
): boolean {
  return (
    Math.abs(node1Pos.x - node2Pos.x) < NODE_WIDTH + NODE_MARGIN &&
    Math.abs(node1Pos.y - node2Pos.y) < NODE_HEIGHT + NODE_MARGIN
  );
}

// Helper function to find a position where a node doesn't overlap with existing nodes
export function findNonOverlappingPosition(
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