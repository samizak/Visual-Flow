import { useCallback, useState } from 'react';
import { Node } from '@xyflow/react';

interface UseNodeClickHandlerProps {
  jsonData: string;
}

export function useNodeClickHandler({ jsonData }: UseNodeClickHandlerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<Record<string, any>>({});
  const [selectedNodeLabel, setSelectedNodeLabel] = useState("");

  const findNodeValue = useCallback((obj: any, key: string): any => {
    // Direct property match
    if (obj && typeof obj === "object" && key in obj) {
      return obj[key];
    }

    // Search in nested objects and arrays
    if (obj && typeof obj === "object") {
      for (const prop in obj) {
        const value = obj[prop];

        // If this property matches our key, return its value
        if (prop === key) {
          return value;
        }

        // If this is an object or array, search inside it
        if (value && typeof value === "object") {
          const found = findNodeValue(value, key);
          if (found !== undefined) {
            return found;
          }
        }
      }
    }

    return undefined;
  }, []);

  const findInObject = useCallback((obj: any, key: string): any => {
    if (!obj || typeof obj !== "object") return undefined;

    if (key in obj) return obj[key];

    for (const prop in obj) {
      const value = obj[prop];
      if (typeof value === "object") {
        const found = findInObject(value, key);
        if (found !== undefined) return found;
      }
    }

    return undefined;
  }, []);

  const handleArrayPath = useCallback((parsedJson: any, parts: string[]) => {
    const arrayName = parts[0];
    const indexPath = parts.slice(1);

    // Handle nested array indices (e.g., "products > 1 > num > 3")
    let currentValue = parsedJson;
    let currentPath = arrayName;

    // First get to the array
    if (arrayName in parsedJson) {
      currentValue = parsedJson[arrayName];
    } else {
      currentValue = findInObject(parsedJson, arrayName);
      if (currentValue === undefined) {
        throw new Error(`Could not find array: ${arrayName}`);
      }
    }

    // Then navigate through the indices
    for (const indexStr of indexPath) {
      // Handle both numeric indices and property names
      const index = parseInt(indexStr, 10);

      if (!isNaN(index)) {
        // It's a numeric index
        if (Array.isArray(currentValue) && index < currentValue.length) {
          currentValue = currentValue[index];
        } else if (
          typeof currentValue === "object" &&
          currentValue !== null &&
          index in currentValue
        ) {
          // Some objects might have numeric keys
          currentValue = currentValue[index];
        } else {
          throw new Error(
            `Invalid array index: ${indexStr} in path: ${currentPath}`
          );
        }
      } else {
        // It's a property name
        if (
          typeof currentValue === "object" &&
          currentValue !== null &&
          indexStr in currentValue
        ) {
          currentValue = currentValue[indexStr];
        } else {
          throw new Error(
            `Invalid property: ${indexStr} in path: ${currentPath}`
          );
        }
      }

      currentPath += ` > ${indexStr}`;
    }

    return { currentValue, arrayName };
  }, [findInObject]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.data.label === "Root" && jsonData) {
        try {
          const parsedJson = JSON.parse(jsonData);
          setSelectedNodeData(parsedJson);
          setSelectedNodeLabel("Root");
          setDrawerOpen(true);
          return;
        } catch (error) {
          console.error("Error parsing root JSON:", error);
        }
      }

      try {
        const parsedJson = JSON.parse(jsonData);
        const nodeData: any = node.data;

        // Check if this is an array item node (label format: "arrayName > index")
        if (nodeData.label && nodeData.label.includes(" > ")) {
          const parts = nodeData.label.split(" > ");
          
          try {
            const { currentValue, arrayName } = handleArrayPath(parsedJson, parts);
            
            // Create a wrapper object with the appropriate key
            // For array items, use the full path as the label for clarity
            const displayData = { [arrayName]: currentValue };
            setSelectedNodeData(displayData);
            setSelectedNodeLabel(nodeData.label);
            setDrawerOpen(true);
            return;
          } catch (error) {
            console.error("Error processing array path:", error);
            throw error;
          }
        }

        // For non-array nodes, use the existing logic
        let nodeKey = nodeData.label;

        // Get the node value
        const nodeValue = findNodeValue(parsedJson, nodeKey);

        if (nodeValue !== undefined) {
          const displayData = { [nodeKey]: nodeValue };
          setSelectedNodeData(displayData);
          setSelectedNodeLabel(nodeData.label || "Node");
          setDrawerOpen(true);
        } else {
          console.error("Could not find node value for key:", nodeKey);
          setSelectedNodeData({ [nodeKey]: "Could not find data" });
          setSelectedNodeLabel(nodeData.label || "Node");
          setDrawerOpen(true);
        }
      } catch (error) {
        console.error("Error processing node data:", error);

        const nodeData: any = node.data;
        let cleanLabel = nodeData.label || "Node";
        if (cleanLabel.includes(" > ")) {
          cleanLabel = cleanLabel.split(" > ")[0];
        }

        setSelectedNodeData({ [cleanLabel]: "Error retrieving data" });
        setSelectedNodeLabel(nodeData.label || "Node");
        setDrawerOpen(true);
      }
    },
    [jsonData, findNodeValue, handleArrayPath]
  );

  return {
    onNodeClick,
    drawerOpen,
    setDrawerOpen,
    selectedNodeData,
    selectedNodeLabel
  };
}