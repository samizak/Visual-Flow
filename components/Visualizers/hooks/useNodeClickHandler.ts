import { useCallback, useState } from "react";
import { Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";

interface UseNodeClickHandlerProps {
  jsonData: string;
  getNodes?: () => Node[];
  getEdges?: () => any[];
}

export function useNodeClickHandler({ 
  jsonData,
  getNodes: externalGetNodes,
  getEdges: externalGetEdges
}: UseNodeClickHandlerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<Record<string, any>>({});
  const [selectedNodeLabel, setSelectedNodeLabel] = useState("");
  const [nodePath, setNodePath] = useState<Array<{ id: string; label: string; data: any }>>([]);

  // Try to use the React Flow context if available, otherwise use the provided functions
  let reactFlowInstance: { getNodes: () => Node[]; getEdges: () => any[] } | null = null;
  
  try {
    reactFlowInstance = useReactFlow();
  } catch (error) {
    // If useReactFlow fails, we'll use the external functions
  }

  const getNodesFunc = reactFlowInstance?.getNodes || externalGetNodes || (() => []);
  const getEdgesFunc = reactFlowInstance?.getEdges || externalGetEdges || (() => []);

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

  const handleArrayPath = useCallback(
    (parsedJson: any, parts: string[]) => {
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
    },
    [findInObject]
  );

  // New function to find path from root to selected node
  const findPathToNode = useCallback(
    (nodeId: string) => {
      const nodes = getNodesFunc();
      const edges = getEdgesFunc();

      // Start with the target node
      const targetNode = nodes.find((node: Node) => node.id === nodeId);
      if (!targetNode) return [];

      const path: Array<{ id: string; label: string; data: any }> = [];
      let currentNodeId = nodeId;

      // Add the target node to the path
      path.unshift({
        id: targetNode.id,
        label: targetNode.data?.label || ("Unknown" as any),
        data: targetNode.data?.properties || {},
      });

      // Keep traversing up until we reach a node with no incoming edges (root)
      while (currentNodeId) {
        // Find edges where this node is the target
        const incomingEdge = edges.find(
          (edge: any) => edge.target === currentNodeId
        );

        // If no incoming edge, we've reached the root or an orphaned node
        if (!incomingEdge) break;

        // Get the source node
        const sourceNodeId = incomingEdge.source;
        const sourceNode = nodes.find((node: any) => node.id === sourceNodeId);

        if (sourceNode) {
          // Add this node to the beginning of our path
          path.unshift({
            id: sourceNode.id,
            label: sourceNode.data?.label || ("Unknown" as any),
            data: sourceNode.data?.properties || {},
          });

          // Move up to the parent node
          currentNodeId = sourceNodeId;
        } else {
          // Source node not found, break the loop
          break;
        }
      }

      return path;
    },
    [getNodesFunc, getEdgesFunc]
  );

  // Modify the onNodeClick handler to also collect path data
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Prevent event propagation
      event.stopPropagation();

      // Get the node ID and label
      const nodeId = node.id;
      const nodeLabel = node.data?.label || "Unknown Node";

      // Find the path from root to this node
      const path = findPathToNode(nodeId);
      setNodePath(path);

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
            const { currentValue, arrayName } = handleArrayPath(
              parsedJson,
              parts
            );

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
        const nodeKey = nodeData.label;

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
    [jsonData, findPathToNode, findNodeValue, handleArrayPath]
  );

  return {
    onNodeClick,
    drawerOpen,
    setDrawerOpen,
    selectedNodeData,
    selectedNodeLabel,
    nodePath,
  };
}
