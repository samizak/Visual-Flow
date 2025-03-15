import { useState, useCallback, useRef, useEffect } from "react";
import { Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { convertJsonToGroupedFlow } from "../utils/jsonGroupedFlowUtils";

interface UseJsonFlowDataProps {
  jsonData: string;
  edgeType: string;
  isValidJson: boolean;
  onNodeCountChange?: (count: number) => void;
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
}

export function useJsonFlowData({
  jsonData,
  edgeType,
  isValidJson,
  onNodeCountChange,
  setNodes,
  setEdges,
}: UseJsonFlowDataProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [lastValidJson, setLastValidJson] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevEdgeTypeRef = useRef(edgeType);

  // Effect to update edge types when edgeType prop changes
  useEffect(() => {
    setEdges((currentEdges) => {
      if (currentEdges.length > 0 && prevEdgeTypeRef.current !== edgeType) {
        // Update all edges with the new edge type
        const updatedEdges = currentEdges.map((edge) => ({
          ...edge,
          type: edgeType,
        }));

        prevEdgeTypeRef.current = edgeType;
        return updatedEdges;
      }
      return currentEdges;
    });
  }, [edgeType, setEdges]);

  // Convert JSON to nodes and edges
  const processJsonData = useCallback(
    (jsonString: string) => {
      if (!jsonString) {
        setNodes([]);
        setEdges([]);
        setIsLoading(false);
        onNodeCountChange?.(0);
        return;
      }

      try {
        // Only attempt to parse and update if the JSON is valid
        if (isValidJson) {
          const parsedJson = JSON.parse(jsonString);
          const { nodes: flowNodes, edges: flowEdges } =
            convertJsonToGroupedFlow(parsedJson, edgeType);
          setNodes(flowNodes as Node[]);
          setEdges(flowEdges as Edge[]);
          setLastValidJson(jsonString);
          setIsLoading(false);
          onNodeCountChange?.(flowNodes.length);
        } else {
          // If JSON is invalid but we have a previous visualization,
          // just keep the current state and stop loading
          setIsLoading(false);
        }
      } catch (error) {
        if (lastValidJson) {
          // Don't update the visualization if we have a previous valid state
          setIsLoading(false);
        } else {
          // If there's no previous valid state, show empty diagram
          setNodes([]);
          setEdges([]);
          setIsLoading(false);
          onNodeCountChange?.(0);
        }
      }
    },
    [
      edgeType,
      onNodeCountChange,
      isValidJson,
      lastValidJson,
      setNodes,
      setEdges,
    ]
  );

  // Process JSON data with debounce
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only show loading state if we're going from valid to new state
    // and the JSON is valid
    if (lastValidJson !== jsonData && !isLoading && isValidJson) {
      setIsLoading(true);
    }

    // Set a new timer to process the JSON after a delay
    debounceTimerRef.current = setTimeout(() => {
      processJsonData(jsonData);
    }, 800); // 800ms debounce time

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [jsonData, processJsonData, lastValidJson, isLoading, isValidJson]);

  return {
    isLoading,
  };
}
