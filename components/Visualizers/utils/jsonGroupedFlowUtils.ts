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

// Specialized node creation functions
function createArrayNode(
  id: string,
  label: string,
  itemCount: number,
  position: { x: number; y: number }
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
  position: { x: number; y: number }
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
  properties: any[],
  position: { x: number; y: number }
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
  position: { x: number; y: number }
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
  position: { x: number; y: number }
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

  // Helper function to process array items
  // Helper function to process array items
  function processArrayItems(
    data: any[],
    parentId: string,
    key: string,
    position: { x: number; y: number },
    isNestedArray: boolean,
    currentBreadcrumbs: string[]
  ) {
    // Process each array item
    data.forEach((item: any, index: number) => {
      const itemType = getValueType(item);
      const itemId = `node-${nodeId++}`;
      const itemKey = index.toString();
      const itemLabel = `${key} > ${itemKey}`;
      
      // Use calculateChildPosition to determine position
      const childPosition = calculateChildPosition(
        position,
        index,
        data.length
      );
      
      // Apply non-overlapping adjustment
      const itemPosition = findNonOverlappingPosition(childPosition, nodes);
      
      if (itemType === "object" || itemType === "array") {
        if (isNestedArray && itemType === "object") {
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
              // Use calculateChildPosition for nested children too
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
                [...currentBreadcrumbs, itemKey, childKey]
              );
            }
          });
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
            currentBreadcrumbs
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

  // Process the root object - place at (0,0) as the center point
  processJsonNode(json, rootId, null, "Root", 0, 0, "root", []);

  return { nodes, edges };

  // Main function to process JSON nodes recursively
  function processJsonNode(
    data: any,
    currentId: string,
    parentId: string | null,
    key: string,
    xPos: number,
    yPos: number,
    parentType: string | null,
    breadcrumbs: string[]
  ) {
    const dataType = getValueType(data);
    // Removed console.log
    
    // Create current breadcrumb path - but we'll only use the current key for display
    const currentBreadcrumbs = [...breadcrumbs];
    if (key !== "Root") {
      currentBreadcrumbs.push(key);
    }

    // For arrays, we use the key directly without breadcrumbs
    const label = key;

    // Connect to parent if it exists
    if (parentId) {
      edges.push(createEdge(parentId, currentId));
    }

    // Find non-overlapping position
    const position = findNonOverlappingPosition({ x: xPos, y: yPos }, nodes);

    if (data && dataType == "array") {
      // Removed console.log
      
      // Handle empty arrays
      if (data.length === 0) {
        nodes.push(
          createEmptyArrayNode(
            currentId,
            label,
            position
          )
        );
      } else {
        // For nested arrays (when parent type is also array), create a node
        const isNestedArray = parentType === "array";

        if (isNestedArray) {
          // Create a node for the nested array
          nodes.push(
            createArrayNode(
              currentId,
              label,
              data.length,
              position
            )
          );

          // Process array items with the consolidated function
          processArrayItems(
            data,
            currentId,
            key,
            position,
            true, // isNestedArray
            currentBreadcrumbs
          );
        } else {
          // For top-level arrays, process items directly
          processArrayItems(
            data,
            parentId || currentId,
            key,
            position,
            false, // not a nested array
            currentBreadcrumbs
          );
        }
      }
    }

    if (data && dataType === "object") {
      // Removed console.log
      
      // Handle empty objects
      if (Object.keys(data).length === 0) {
        nodes.push(
          createEmptyObjectNode(
            currentId,
            key,
            position
          )
        );
      } else {
        // Using map instead of imperative loop for properties
        const properties = Object.entries(data).map(([propKey, propValue]) => {
          const propType = getValueType(propValue);

          // For objects, show the number of keys instead of {...}
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
          // For arrays, show the number of items instead of [...]
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

        // Create the node
        nodes.push(
          createObjectNode(
            currentId, 
            key, 
            properties, 
            position
          )
        );

        // Process children (objects and arrays only) - using filter and map
        const childEntries = Object.entries(data).filter(([_, value]) => {
          const type = getValueType(value);
          return type === "object" || type === "array";
        });
        
        // Using map instead of forEach for processing children
        childEntries.map(([childKey, childValue], childIndex) => {
          const childType = getValueType(childValue);
          // Removed console.log
          
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
          // Removed console.log
          
          // Use calculateChildPosition for children
          const childPosition = calculateChildPosition(
            position,
            childIndex,
            childEntries.length
          );
          
          // Process the child node
          processJsonNode(
            childValue,
            childId,
            currentId,
            childKey,
            childPosition.x,
            childPosition.y,
            dataType, // Pass current type as parent type
            currentBreadcrumbs // Pass current breadcrumbs
          );
          
          return childId; // Return childId for potential future use
        });
      }
    }
  }
};
