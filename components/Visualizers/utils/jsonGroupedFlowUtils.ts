import { Node, Edge } from "@xyflow/react";
import { JsonFlowResult } from "../types/jsonFlowTypes";
import {
  getValueType,
  getDisplayValue,
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_MARGIN,
} from "./jsonUtils";
import { findNonOverlappingPosition, calculateChildPosition } from "./nodePositioning";

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
    [{ key: "", value: `[${itemCount} ${itemCount === 1 ? "item" : "items"}]` }],
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
  return createNode(
    id,
    "object",
    label,
    properties,
    position
  );
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
  return createNode(
    id,
    "primitive",
    label,
    [{ key: "", value }],
    position
  );
}

// Helper function to create an edge with a unique ID
function createEdge(source: string, target: string): Edge {
  return {
    id: `edge-${source}-${target}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    source,
    target,
    type: "default",
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
  processJsonNode(json, rootId, null, "Root", 0, 0, "root", []);

  return { nodes, edges };

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
      edges.push(createEdge(parentId, currentId));
    }

    // Find non-overlapping position
    const position = findNonOverlappingPosition({ x: xPos, y: yPos }, nodes);

    // Route to the appropriate handler based on data type
    if (data && dataType === "array") {
      processArrayNode(data, currentId, parentId, key, position, parentType, breadcrumbs);
    } else if (data && dataType === "object") {
      processObjectNode(data, currentId, key, position, parentType, breadcrumbs);
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
      nodes.push(
        createEmptyArrayNode(
          currentId,
          key,
          position
        )
      );
      return;
    }

    // For nested arrays (when parent type is also array), create a node
    const isNestedArray = parentType === "array";

    if (isNestedArray) {
      // Create a node for the nested array
      nodes.push(
        createArrayNode(
          currentId,
          key,
          data.length,
          position
        )
      );

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
      nodes.push(
        createEmptyObjectNode(
          currentId,
          key,
          position
        )
      );
      return;
    }

    // Create properties for the object node
    const properties = createObjectProperties(data);

    // Create the node
    nodes.push(
      createObjectNode(
        currentId, 
        key, 
        properties, 
        position
      )
    );

    // Process children
    processObjectChildren(data, currentId, position, breadcrumbs);
  }

  // Helper function to create object properties
  function createObjectProperties(data: Record<string, any>): NodeProperty[] {
    return Object.entries(data).map(([propKey, propValue]) => {
      const propType = getValueType(propValue);

      // For objects, show the number of keys
      if (propType === "object") {
        const keyCount = propValue
          ? Object.keys(propValue as any).length
          : 0;
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
      return type === "object" || type === "array";
    });
    
    // Process each child
    childEntries.map(([childKey, childValue], childIndex) => {
      const childType = getValueType(childValue);
      
      // Skip empty objects and arrays
      if (childType === "object" && 
          childValue && 
          Object.keys(childValue as any).length === 0) {
        return null;
      }
      
      if (childType === "array" && 
          (!Array.isArray(childValue) || 
           (childValue as any[]).length === 0)) {
        return null;
      }
      
      const childId = `node-${nodeId++}`;
      
      // Create child breadcrumbs
      const childBreadcrumbs = [...breadcrumbs, childKey];
      
      // Calculate child position
      const childPosition = calculateChildPosition(
        parentPosition,
        childIndex,
        childEntries.length
      );
      
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
      
      return childId;
    });
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
    // Process each array item
    data.forEach((item: any, index: number) => {
      const itemType = getValueType(item);
      const itemId = `node-${nodeId++}`;
      const itemKey = index.toString();
      
      // Create breadcrumb path for this item
      const itemBreadcrumbs = [...breadcrumbs, itemKey];
      const itemLabel = breadcrumbs.length > 0 
        ? `${breadcrumbs[breadcrumbs.length - 1]} > ${itemKey}`
        : `${key} > ${itemKey}`;
      
      // Calculate position
      const childPosition = calculateChildPosition(
        position,
        index,
        data.length
      );
      
      // Apply non-overlapping adjustment
      const itemPosition = findNonOverlappingPosition(childPosition, nodes);
      
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
        edges.push(createEdge(parentId, itemId));
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
    // Create a node for the object but mark it as being inside an array
    nodes.push(
      createObjectNode(
        itemId,
        itemLabel,
        Object.entries(item).map(([k, v]) => {
          const vType = getValueType(v);
          return {
            key: k,
            value: getDisplayValue(v, vType)
          };
        }),
        itemPosition
      )
    );
    
    // Connect to the array node
    edges.push(createEdge(parentId, itemId));
    
    // Process children of this object
    Object.entries(item).forEach(([childKey, childValue], childIndex) => {
      const childType = getValueType(childValue);
      
      if (childType === "object" || childType === "array") {
        const childId = `node-${nodeId++}`;
        // Calculate position for nested children
        const nestedChildPosition = calculateChildPosition(
          itemPosition,
          childIndex,
          Object.keys(item).length
        );
        
        processJsonNode(
          childValue,
          childId,
          itemId,
          childKey,
          nestedChildPosition.x,
          nestedChildPosition.y,
          "array", // Pass array as parent type
          [...itemBreadcrumbs, childKey]
        );
      }
    });
  }
};
