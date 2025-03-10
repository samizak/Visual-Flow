import { processArrayItems } from "../components/Visualizers/utils/arrayProcessor";
import { Node, Edge } from "@xyflow/react";

describe("Array Processor Tests", () => {
  let nodes: Node[];
  let edges: Edge[];
  let nodeId: number;

  beforeEach(() => {
    nodes = [];
    edges = [];
    nodeId = 0;
  });

  const mockProcessJsonNode = jest.fn();

  test("processes empty array correctly", () => {
    const emptyArray: any[] = [];
    const result = processArrayItems(
      emptyArray,
      "parent-1",
      "testArray",
      0,
      0,
      nodes,
      edges,
      nodeId,
      mockProcessJsonNode
    );

    expect(nodes.length).toBe(1);
    expect((nodes[0] as any).data.properties[0].value).toBe("Empty array");
    expect(edges.length).toBe(1);
  });

  test("processes nested object array correctly", () => {
    const testData = [
      {
        name: "Granny Smith",
        characteristics: {
          season: ["September", "October", "November"],
        },
      },
    ];

    const result = processArrayItems(
      testData,
      "parent-1",
      "varieties",
      0,
      0,
      nodes,
      edges,
      nodeId,
      mockProcessJsonNode
    );

    expect(nodes.length).toBeGreaterThan(0);
    expect(edges.length).toBeGreaterThan(0);

    // Verify parent-child relationships
    const parentNode = nodes.find((n) => n.data.label === "varieties 0");
    expect(parentNode).toBeDefined();

    // Verify edges connect correctly
    const parentEdges = edges.filter((e) => e.source === "parent-1");
    expect(parentEdges.length).toBeGreaterThan(0);
  });

  test("processes primitive array correctly", () => {
    const primitiveArray = ["test1", "test2", "test3"];

    const result = processArrayItems(
      primitiveArray,
      "parent-1",
      "testArray",
      0,
      0,
      nodes,
      edges,
      nodeId,
      mockProcessJsonNode
    );

    expect(nodes.length).toBe(primitiveArray.length);
    expect(edges.length).toBe(primitiveArray.length);
  });

  test("handles invalid input gracefully", () => {
    const invalidInput: any = "not an array";

    const result = processArrayItems(
      invalidInput,
      "parent-1",
      "testArray",
      0,
      0,
      nodes,
      edges,
      nodeId,
      mockProcessJsonNode
    );

    expect(nodes.length).toBe(0);
    expect(edges.length).toBe(0);
  });
});
