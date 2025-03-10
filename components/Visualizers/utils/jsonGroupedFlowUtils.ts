import { Node, Edge } from "@xyflow/react";
import { JsonFlowResult } from "../types/jsonFlowTypes";
import {
  getValueType,
  getDisplayValue,
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_MARGIN,
} from "./jsonUtils";

// Define more specific interfaces for node properties
interface NodeProperty {
  key: string;
  value: string;
  type?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

// Helper function to create a node
function createNode(
  id: string,
  type: string,
  label: string,
  properties: NodeProperty[],
  position: NodePosition
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
    // Add width and height for dagre layout calculations
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  };
}

// Specialized node creation functions
function createArrayNode(
  id: string,
  label: string,
  itemCount: number,
  position: NodePosition
): Node {
  return createNode(
    id,
    "array",
    label,
    [
      {
        key: "",
        value: `[${itemCount} ${itemCount === 1 ? "item" : "items"}]`,
      },
    ],
    position
  );
}

function createEmptyArrayNode(
  id: string,
  label: string,
  position: NodePosition
): Node {
  return createNode(
    id,
    "array",
    label,
    [{ key: "", value: "[0 items]" }],
    position
  );
}

function createObjectNode(
  id: string,
  label: string,
  properties: NodeProperty[],
  position: NodePosition
): Node {
  return createNode(id, "object", label, properties, position);
}

function createEmptyObjectNode(
  id: string,
  label: string,
  position: NodePosition
): Node {
  return createNode(
    id,
    "object",
    label,
    [{ key: "", value: "{0 keys}" }],
    position
  );
}

function createPrimitiveNode(
  id: string,
  label: string,
  value: any,
  position: NodePosition
): Node {
  return createNode(id, "primitive", label, [{ key: "", value }], position);
}

// Helper function to create an edge with a unique ID
// Update your convertJsonToGroupedFlow function to accept and use edgeType
export function convertJsonToGroupedFlow(
  json: any,
  edgeType: string = "smoothstep"
): JsonFlowResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;

  // Memoization caches
  const hasChildrenCache = new Map<string, boolean>();
  const objectPropertiesCache = new Map<object, NodeProperty[]>();

  // Create root node at the center
  const rootId = `node-${nodeId++}`;

  // Process the root object - place at (0,0) as the center point
  processJsonNode(json, rootId, null, "Root", 0, 0, "root", []);

  // Apply dagre layout to position all nodes
  const positionedNodes = applyDagreLayout(nodes, edges);

  return { nodes: positionedNodes, edges };

  // Apply dagre layout to position nodes
  function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
    // Import dagre dynamically to avoid SSR issues
    const dagre = require("@dagrejs/dagre");

    // Create a new dagre graph
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Set graph direction and spacing
    dagreGraph.setGraph({
      rankdir: "LR", // Left to right layout
      nodesep: NODE_MARGIN * 2,
      ranksep: NODE_MARGIN * 3,
      marginx: 50,
      marginy: 50,
    });

    // Add nodes to dagre graph
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      });
    });

    // Add edges to dagre graph
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Apply calculated positions to nodes
    return nodes.map((node) => {
      const dagreNode = dagreGraph.node(node.id);

      // Only update position if dagre calculated one
      if (dagreNode) {
        // Dagre positions nodes by their center, but React Flow uses top-left corner
        const position = {
          x: dagreNode.x - NODE_WIDTH / 2,
          y: dagreNode.y - NODE_HEIGHT / 2,
        };

        return {
          ...node,
          position,
        };
      }

      return node;
    });
  }

  // Memoized function to check if an object has complex children
  function memoizedHasComplexChildren(
    data: Record<string, any>,
    cacheKey: string
  ): boolean {
    if (hasChildrenCache.has(cacheKey)) {
      return hasChildrenCache.get(cacheKey)!;
    }

    const hasChildren = Object.values(data).some((value) => {
      const type = getValueType(value);
      return (
        (type === "object" && Object.keys(value || {}).length > 0) ||
        (type === "array" && Array.isArray(value) && value.length > 0)
      );
    });

    hasChildrenCache.set(cacheKey, hasChildren);
    return hasChildren;
  }

  // Memoized function to create object properties
  function memoizedCreateObjectProperties(
    data: Record<string, any>
  ): NodeProperty[] {
    // Use the object reference as a key
    if (objectPropertiesCache.has(data)) {
      return objectPropertiesCache.get(data)!;
    }

    const properties = createObjectProperties(data);
    objectPropertiesCache.set(data, properties);
    return properties;
  }

  // Process object children
  function processObjectChildren(
    data: Record<string, any>,
    parentId: string,
    parentPosition: NodePosition,
    breadcrumbs: string[]
  ): void {
    // Filter for complex children (objects and arrays)
    const childEntries = Object.entries(data).filter(([_, value]) => {
      const type = getValueType(value);
      return (
        (type === "object" && Object.keys(value || {}).length > 0) ||
        (type === "array" && Array.isArray(value) && value.length > 0)
      );
    });

    // Process each child with temporary positions - dagre will reposition
    childEntries.forEach(([childKey, childValue], childIndex) => {
      const childId = `node-${nodeId++}`;

      // Create child breadcrumbs
      const childBreadcrumbs = [...breadcrumbs, childKey];

      // Use temporary position - dagre will reposition later
      const childPosition = { x: 0, y: 0 };

      // Process the child node
      processJsonNode(
        childValue,
        childId,
        parentId,
        childKey,
        childPosition.x,
        childPosition.y,
        "object", // Parent type is object
        childBreadcrumbs
      );
    });
  }

  // Main function to process JSON nodes recursively - now acts as a router
  function processJsonNode(
    data: any,
    currentId: string,
    parentId: string | null,
    key: string,
    xPos: number,
    yPos: number,
    parentType: string | null,
    breadcrumbs: string[]
  ): void {
    const dataType = getValueType(data);

    // Connect to parent if it exists
    if (parentId) {
      edges.push(createEdge(parentId, currentId, edgeType));
    }

    // Use temporary position - dagre will reposition later
    const position = { x: 0, y: 0 };

    // Route to the appropriate handler based on data type
    if (data && dataType === "array") {
      processArrayNode(
        data,
        currentId,
        parentId,
        key,
        position,
        parentType,
        breadcrumbs
      );
    } else if (data && dataType === "object") {
      processObjectNode(
        data,
        currentId,
        key,
        position,
        parentType,
        breadcrumbs
      );
    } else {
      // For primitive types (should not happen at this level, but just in case)
      nodes.push(
        createPrimitiveNode(
          currentId,
          key,
          getDisplayValue(data, dataType),
          position
        )
      );
    }
  }

  // Process array nodes
  function processArrayNode(
    data: any[],
    currentId: string,
    parentId: string | null,
    key: string,
    position: NodePosition,
    parentType: string | null,
    breadcrumbs: string[]
  ): void {
    // Handle empty arrays
    if (data.length === 0) {
      nodes.push(createEmptyArrayNode(currentId, key, position));
      return;
    }

    // For nested arrays (when parent type is also array), create a node
    const isNestedArray = parentType === "array";

    if (isNestedArray) {
      // Create a node for the nested array
      nodes.push(createArrayNode(currentId, key, data.length, position));

      // Process array items
      processArrayItems(
        data,
        currentId,
        key,
        position,
        true, // isNestedArray
        breadcrumbs
      );
    } else {
      // For top-level arrays, process items directly
      processArrayItems(
        data,
        parentId || currentId,
        key,
        position,
        false, // not a nested array
        breadcrumbs
      );
    }
  }

  // Process object nodes
  function processObjectNode(
    data: Record<string, any>,
    currentId: string,
    key: string,
    position: NodePosition,
    parentType: string | null,
    breadcrumbs: string[]
  ): void {
    // Handle empty objects
    if (Object.keys(data).length === 0) {
      nodes.push(createEmptyObjectNode(currentId, key, position));
      return;
    }

    // Create properties for the object node using memoization
    const properties = memoizedCreateObjectProperties(data);

    // Create the node
    nodes.push(createObjectNode(currentId, key, properties, position));

    // Check if we need to process children using memoization
    const hasChildrenCacheKey = `${currentId}-hasChildren`;
    if (memoizedHasComplexChildren(data, hasChildrenCacheKey)) {
      // Process children
      processObjectChildren(data, currentId, position, breadcrumbs);
    }
  }

  // Helper function to process array items
  function processArrayItems(
    data: any[],
    parentId: string,
    key: string,
    position: NodePosition,
    isNestedArray: boolean,
    breadcrumbs: string[]
  ): void {
    // Process each array item with temporary positions - dagre will reposition
    data.forEach((item: any, index: number) => {
      const itemType = getValueType(item);
      const itemId = `node-${nodeId++}`;
      const itemKey = index.toString();

      // Create breadcrumb path for this item
      const itemBreadcrumbs = [...breadcrumbs, itemKey];
      const itemLabel =
        breadcrumbs.length > 0
          ? `${breadcrumbs[breadcrumbs.length - 1]} > ${itemKey}`
          : `${key} > ${itemKey}`;

      // Use temporary position - dagre will reposition later
      const itemPosition = { x: 0, y: 0 };

      if (itemType === "object" || itemType === "array") {
        if (isNestedArray && itemType === "object") {
          processNestedArrayObjectItem(
            item,
            itemId,
            parentId,
            itemLabel,
            itemPosition,
            itemBreadcrumbs
          );
        } else {
          // For arrays or objects in non-nested arrays, process recursively
          processJsonNode(
            item,
            itemId,
            parentId,
            itemLabel,
            itemPosition.x,
            itemPosition.y,
            "array", // Pass array as parent type
            itemBreadcrumbs
          );
        }
      } else {
        // For primitive values, create a simple node
        nodes.push(
          createPrimitiveNode(
            itemId,
            itemLabel,
            getDisplayValue(item, itemType),
            itemPosition
          )
        );

        // Connect to the parent node
        edges.push(createEdge(parentId, itemId, edgeType));
      }
    });
  }

  // Process objects inside nested arrays
  function processNestedArrayObjectItem(
    item: Record<string, any>,
    itemId: string,
    parentId: string,
    itemLabel: string,
    itemPosition: NodePosition,
    itemBreadcrumbs: string[]
  ): void {
    // Create object properties with memoization
    const properties = memoizedCreateObjectProperties(item);

    // Create a node for the object but mark it as being inside an array
    nodes.push(createObjectNode(itemId, itemLabel, properties, itemPosition));

    // Connect to the array node
    edges.push(createEdge(parentId, itemId, edgeType));

    // Check if we need to process children using memoization
    const hasChildrenCacheKey = `${itemId}-hasChildren`;
    if (memoizedHasComplexChildren(item, hasChildrenCacheKey)) {
      // Filter for complex children
      const complexChildren = Object.entries(item).filter(([_, value]) => {
        const type = getValueType(value);
        return (
          (type === "object" && Object.keys(value || {}).length > 0) ||
          (type === "array" && Array.isArray(value) && value.length > 0)
        );
      });

      // Process each child with temporary positions - dagre will reposition
      complexChildren.forEach(([childKey, childValue], childIndex) => {
        const childId = `node-${nodeId++}`;

        // Use temporary position - dagre will reposition later
        const childPosition = { x: 0, y: 0 };

        processJsonNode(
          childValue,
          childId,
          itemId,
          childKey,
          childPosition.x,
          childPosition.y,
          "array", // Pass array as parent type
          [...itemBreadcrumbs, childKey]
        );
      });
    }
  }
}
// Replace the stub implementation at the bottom with a proper implementation
function createObjectProperties(data: Record<string, any>): NodeProperty[] {
  return Object.entries(data).map(([propKey, propValue]) => {
    const propType = getValueType(propValue);

    // For objects, show the number of keys
    if (propType === "object") {
      const keyCount = propValue ? Object.keys(propValue as any).length : 0;
      return {
        key: propKey,
        value: `{${keyCount} ${keyCount === 1 ? "key" : "keys"}}`,
        type: propType,
      };
    }
    // For arrays, show the number of items
    else if (propType === "array") {
      const arrayValue = propValue as any[];
      const itemCount = Array.isArray(arrayValue) ? arrayValue.length : 0;
      return {
        key: propKey,
        value: `[${itemCount} ${itemCount === 1 ? "item" : "items"}]`,
        type: propType,
      };
    }
    // For primitive types, show the value
    else {
      return {
        key: propKey,
        value: getDisplayValue(propValue, propType),
        type: propType,
      };
    }
  });
}

// Add this function to your file, preferably near other utility functions
function createEdge(
  source: string,
  target: string,
  edgeType: string = "smoothstep"
): Edge {
  return {
    id: `edge-${source}-${target}-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`,
    source,
    target,
    type: edgeType,
  };
}
