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
  // Round positions to nearest 10 for cleaner layout
  let position = {
    x: Math.round(newPos.x / 10) * 10,
    y: Math.round(newPos.y / 10) * 10,
  };

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

// Add export keyword to make the function available for import
export function calculateChildPosition(
  parentPos: { x: number; y: number },
  childIndex: number,
  totalChildren: number,
  level: number = 1
): { x: number; y: number } {
  // Base horizontal spacing from parent
  const baseXOffset = NODE_WIDTH + NODE_MARGIN * 3;

  // Calculate vertical distribution
  let yOffset = 0;

  if (totalChildren > 1) {
    // Create a balanced tree with parent in the middle
    const totalHeight = (totalChildren - 1) * (NODE_HEIGHT + NODE_MARGIN * 2);
    yOffset = childIndex * (NODE_HEIGHT + NODE_MARGIN * 2) - totalHeight / 2;
  }

  // Round positions to nearest 10
  return {
    x: Math.round((parentPos.x + baseXOffset) / 10) * 10,
    y: Math.round((parentPos.y + yOffset) / 10) * 10,
  };
}
