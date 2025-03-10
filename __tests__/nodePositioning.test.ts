import {
  findNonOverlappingPosition,
  calculateChildPosition,
} from "../components/Visualizers/utils/nodePositioning";
import {
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_MARGIN,
} from "../components/Visualizers/utils/jsonUtils";

describe("Node Positioning Tests", () => {
  test("finds non-overlapping position", () => {
    const existingNodes = [
      { position: { x: 0, y: 0 } },
      { position: { x: 100, y: 100 } },
    ];

    const newPos = { x: 0, y: 0 };
    const result = findNonOverlappingPosition(newPos, existingNodes as any);

    // Since there's a node at (0,0), the new position should be offset
    expect(result.x).toBe(0);
    expect(result.y).toBe(NODE_HEIGHT + NODE_MARGIN);
    expect(Math.round(result.x) % 10).toBe(0); // Should be rounded to nearest 10
    expect(Math.round(result.y) % 10).toBe(0);
  });

  test("handles multiple overlapping nodes", () => {
    const existingNodes = [
      { position: { x: 0, y: 0 } },
      { position: { x: 0, y: NODE_HEIGHT + NODE_MARGIN } },
    ];

    const newPos = { x: 0, y: 0 };
    const result = findNonOverlappingPosition(newPos, existingNodes as any);

    expect(result.y).toBe((NODE_HEIGHT + NODE_MARGIN) * 2);
  });

  test("calculates child position correctly", () => {
    const parentPos = { x: 0, y: 0 };
    const result = calculateChildPosition(parentPos, 0, 3);

    // Test horizontal spacing
    expect(result.x).toBe(Math.round((NODE_WIDTH + NODE_MARGIN * 3) / 10) * 10);

    // Test vertical positioning for first child of three
    const expectedY = Math.round(-(NODE_HEIGHT + NODE_MARGIN * 2) / 10) * 10;
    expect(result.y).toBe(expectedY);

    // Test rounding
    expect(Math.round(result.x) % 10).toBe(0);
    expect(Math.round(result.y) % 10).toBe(0);
  });

  test("calculates middle child position correctly", () => {
    const parentPos = { x: 0, y: 0 };
    const result = calculateChildPosition(parentPos, 1, 3);

    expect(result.x).toBe(Math.round((NODE_WIDTH + NODE_MARGIN * 3) / 10) * 10);
    expect(result.y).toBe(0); // Middle child should be at same y as parent
  });

  describe("Diagram Header Test", () => {
    test("Displays Header correctly", () => {});
  });
});
