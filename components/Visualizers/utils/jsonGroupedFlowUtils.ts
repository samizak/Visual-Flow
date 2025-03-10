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
    breadcrumbs: string[] // Add breadcrumbs parameter to track path
  ) {
    const dataType = getValueType(data);
    console.log(
      `Processing node: ${key}, dataType: ${dataType}, parentType: ${parentType}`
    );
    // Create current breadcrumb path - but we'll only use the current key for display
    const currentBreadcrumbs = [...breadcrumbs];
    if (key !== "Root") {
      currentBreadcrumbs.push(key);
    }

    // For arrays, we use the key directly without breadcrumbs
    const label = key;

    // Connect to parent if it exists
    if (parentId) {
      const uniqueEdgeId = `edge-${parentId}-${currentId}-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      edges.push({
        id: uniqueEdgeId,
        source: parentId,
        target: currentId,
        type: "default",
      });
    }

    // Find non-overlapping position
    const position = findNonOverlappingPosition({ x: xPos, y: yPos }, nodes);

    if (data && dataType == "array") {
      console.log(
        `Creating array node: ${key}, isNestedArray: ${parentType === "array"}`
      );
      // Handle empty arrays
      if (data.length === 0) {
        nodes.push(
          createNode(
            currentId,
            "array", // This is correct - using "array" type
            label,
            [{ key: "", value: "[0 items]" }],
            position
          )
        );
      } else {
        // For nested arrays (when parent type is also array), create a node
        const isNestedArray = parentType === "array";

        if (isNestedArray) {
          console.log(
            `Creating nested array node: ${currentId}, label: ${label}`
          );
          // Create a node for the nested array
          nodes.push(
            createNode(
              currentId,
              "array",
              label,
              [{ key: "", value: `[${data.length} items]` }],
              position
            )
          );

          // Use currentId as the parent for array items
          const arrayParentId = currentId;

          // Calculate positions for array items
          const itemX = position.x + NODE_WIDTH + NODE_MARGIN;
          const itemsCount = data.length;
          const itemsTotalHeight = itemsCount * (NODE_HEIGHT + NODE_MARGIN);
          let itemY = position.y - itemsTotalHeight / 2 + NODE_HEIGHT / 2;

          // Process each array item
          data.forEach((item: any, index: number) => {
            const itemType = getValueType(item);
            const itemId = `node-${nodeId++}`;
            const itemKey = index.toString();
            
            if (itemType === "object" || itemType === "array") {
              // For objects or arrays in the array, process recursively with proper label
              const arrayItemLabel = `${key} > ${itemKey}`;
              
              // If this is an object inside an array, we need to create a node with array type
              if (itemType === "object") {
                // Create a node for the object but mark it as being inside an array
                nodes.push(
                  createNode(
                    itemId,
                    "array", // Force array type for objects inside arrays
                    arrayItemLabel,
                    Object.entries(item).map(([k, v]) => {
                      const vType = getValueType(v);
                      return {
                        key: k,
                        value: getDisplayValue(v, vType)
                      };
                    }),
                    { x: itemX, y: itemY }
                  )
                );
                
                // Connect to the array node
                const itemEdgeId = `edge-${arrayParentId}-${itemId}-${Date.now()}-${Math.floor(
                  Math.random() * 1000
                )}`;
                edges.push({
                  id: itemEdgeId,
                  source: arrayParentId,
                  target: itemId,
                  type: "default",
                });
                
                // Process children of this object
                const childX = itemX + NODE_WIDTH + NODE_MARGIN;
                let childY = itemY;
                
                Object.entries(item).forEach(([childKey, childValue]) => {
                  const childType = getValueType(childValue);
                  
                  if (childType === "object" || childType === "array") {
                    const childId = `node-${nodeId++}`;
                    processJsonNode(
                      childValue,
                      childId,
                      itemId,
                      childKey,
                      childX,
                      childY,
                      "array", // Pass array as parent type
                      [...currentBreadcrumbs, itemKey, childKey]
                    );
                    childY += NODE_HEIGHT + NODE_MARGIN;
                  }
                });
              } else {
                // For actual arrays, use the normal processing
                processJsonNode(
                  item,
                  itemId,
                  arrayParentId,
                  arrayItemLabel,
                  itemX,
                  itemY,
                  "array", // Pass array as parent type
                  currentBreadcrumbs
                );
              }
            } else {
              // For primitive values, create a simple node with key>index format
              const itemLabel = `${key} > ${itemKey}`;
              nodes.push(
                createNode(
                  itemId,
                  "primitive",
                  itemLabel,
                  [{ key: "", value: getDisplayValue(item, itemType) }],
                  { x: itemX, y: itemY }
                )
              );

              // Connect to the array node
              const itemEdgeId = `edge-${arrayParentId}-${itemId}-${Date.now()}-${Math.floor(
                Math.random() * 1000
              )}`;
              edges.push({
                id: itemEdgeId,
                source: arrayParentId,
                target: itemId,
                type: "default",
              });
            }
  
            itemY += NODE_HEIGHT + NODE_MARGIN;
          });
        } else {
          // For top-level arrays, keep the existing behavior
          // Calculate positions for array items
          const itemX = position.x + NODE_WIDTH + NODE_MARGIN;
          const itemsCount = data.length;
          const itemsTotalHeight = itemsCount * (NODE_HEIGHT + NODE_MARGIN);
          let itemY = position.y - itemsTotalHeight / 2 + NODE_HEIGHT / 2;

          // Process each array item directly without creating an array node
          data.forEach((item: any, index: number) => {
            const itemType = getValueType(item);
            console.log(`Top-level array item ${index}, type: ${itemType}`);
            const itemId = `node-${nodeId++}`;
            const itemKey = `${index}`;

            if (itemType === "object" || itemType === "array") {
              // For objects or arrays in the array, process recursively with proper label
              const arrayItemLabel = `${key} > ${itemKey}`;
              console.log(
                `Processing top-level array item: ${arrayItemLabel}, type: ${itemType}`
              );
              processJsonNode(
                item,
                itemId,
                parentId, // Connect directly to ancestor
                arrayItemLabel, // Use parent key>index format for nested arrays
                itemX,
                itemY,
                "array", // Explicitly pass "array" as the parent type
                currentBreadcrumbs // Pass current breadcrumbs
              );
            } else {
              // For primitive values, create a simple node with key>index format
              const itemLabel = `${key} > ${itemKey}`;
              nodes.push(
                createNode(
                  itemId,
                  "primitive",
                  itemLabel,
                  [{ key: "", value: getDisplayValue(item, itemType) }],
                  { x: itemX, y: itemY }
                )
              );

              // Connect directly to the ancestor node
              const itemEdgeId = `edge-${parentId}-${itemId}-${Date.now()}-${Math.floor(
                Math.random() * 1000
              )}`;
              edges.push({
                id: itemEdgeId,
                source: parentId as string,
                target: itemId,
                type: "default",
              });
            }

            itemY += NODE_HEIGHT + NODE_MARGIN;
          });
        }
      }
    }

    if (data && dataType === "object") {
      console.log(
        `Creating object node: ${key}, keys: ${Object.keys(data).length}`
      );
      // Handle empty objects
      if (Object.keys(data).length === 0) {
        nodes.push(
          createNode(
            currentId,
            "object", // This is correct - using "object" type
            key, // Use original key for objects, not breadcrumbs
            [{ key: "", value: "{0 keys}" }],
            position
          )
        );
      } else {
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
        nodes.push(createNode(currentId, "object", key, properties, position));

        // Process children (objects and arrays only)
        const childX = position.x + NODE_WIDTH + NODE_MARGIN;
        const childrenCount = Object.entries(data).filter(([_, value]) => {
          const type = getValueType(value);
          return type === "object" || type === "array";
        }).length;

        const totalHeight = childrenCount * (NODE_HEIGHT + NODE_MARGIN);
        let childY = position.y - totalHeight / 2 + NODE_HEIGHT / 2;

        // When processing children, pass the current type as parent type
        Object.entries(data).forEach(([childKey, childValue]) => {
          const childType = getValueType(childValue);
          console.log(`Object child: ${childKey}, type: ${childType}`);
          if (childType === "object") {
            // Skip creating nodes for empty objects
            if (childValue && Object.keys(childValue as any).length === 0) {
              // Don't create a node, just show in the parent's properties
              return;
            }

            const childId = `node-${nodeId++}`;
            console.log(`Processing object child: ${childKey}`);
            processJsonNode(
              childValue,
              childId,
              currentId,
              childKey,
              childX,
              childY,
              dataType, // Pass current type as parent type
              currentBreadcrumbs // Pass current breadcrumbs
            );
            childY += NODE_HEIGHT + NODE_MARGIN;
          } else if (childType === "array") {
            // Skip creating nodes for empty arrays
            if (
              !Array.isArray(childValue) ||
              (childValue as any[]).length === 0
            ) {
              // Don't create a node, just show in the parent's properties
              return;
            }

            const childId = `node-${nodeId++}`;
            console.log(
              `Processing array child: ${childKey}, length: ${
                (childValue as any[]).length
              }`
            );
            processJsonNode(
              childValue,
              childId,
              currentId,
              childKey,
              childX,
              childY,
              dataType, // Pass current type as parent type
              currentBreadcrumbs // Pass current breadcrumbs
            );
            childY += NODE_HEIGHT + NODE_MARGIN;
          }
        });
      }
    }
  }
};
