import { useCallback } from "react";
import { Node, Edge, useReactFlow } from "@xyflow/react";

interface NodeInteractionHooks {
  highlightNodesAndEdges: () => void;
  resetHighlight: () => void;
  toggleNodeCollapse: (e: React.MouseEvent) => void;
  togglePropertyCollapse: (e: React.MouseEvent, propKey: string) => void;
  handleDragStart: () => void;
  handleDragStop: () => void;
  hasOutgoingEdges: () => boolean;
}

export const useNodeInteractions = (
  id: string,
  isDragging: boolean,
  setIsDragging: (isDragging: boolean) => void,
  isNodeCollapsed: boolean,
  setIsNodeCollapsed: (isCollapsed: boolean) => void,
  collapsedProperties: Record<string, boolean>,
  setCollapsedProperties: (
    callback: (prev: Record<string, boolean>) => Record<string, boolean>
  ) => void,
  hasChildren?: boolean
): NodeInteractionHooks => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  // Helper function to find all descendants of a node (not just direct children)
  const findAllDescendants = useCallback(
    (
      nodeId: string,
      edges: Edge[],
      visited = new Set<string>()
    ): { descendantNodes: Set<string>; descendantEdges: Set<string> } => {
      // Add this node to visited set to prevent infinite recursion
      visited.add(nodeId);

      const descendantNodes = new Set<string>();
      const descendantEdges = new Set<string>();

      // Find direct children first
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Process each direct child
      childEdges.forEach((edge) => {
        // Add this edge
        descendantEdges.add(edge.id);

        // Add the direct child
        descendantNodes.add(edge.target);

        // Only recurse if we haven't visited this node before
        if (!visited.has(edge.target)) {
          // Recursively find all descendants of this child
          const childResults = findAllDescendants(
            edge.target,
            edges,
            new Set([...visited])
          );

          // Add all descendants from the recursive call
          childResults.descendantNodes.forEach((id) => descendantNodes.add(id));
          childResults.descendantEdges.forEach((id) => descendantEdges.add(id));
        }
      });

      return { descendantNodes, descendantEdges };
    },
    []
  );

  // Helper function to get direct child edges
  const getDirectChildEdges = useCallback((nodeId: string, edges: Edge[]) => {
    return edges.filter((edge) => edge.source === nodeId);
  }, []);

  // Helper function to toggle flow element class
  const toggleFlowElementClass = useCallback(
    (addClass: boolean, className: string) => {
      const flowElement = document.querySelector(".react-flow");
      if (flowElement) {
        if (addClass) {
          flowElement.classList.add(className);
        } else {
          flowElement.classList.remove(className);
        }
      }
    },
    []
  );

  // Helper function to update node visibility
  const updateNodesVisibility = useCallback(
    (nodes: Node[], nodesToUpdate: Set<string>, hidden: boolean) => {
      return nodes.map((node) => {
        if (nodesToUpdate.has(node.id)) {
          return {
            ...node,
            hidden,
          };
        }
        return node;
      });
    },
    []
  );

  // Helper function to update edge visibility
  const updateEdgesVisibility = useCallback(
    (edges: Edge[], edgesToUpdate: Set<string>, hidden: boolean) => {
      return edges.map((edge) => {
        if (edgesToUpdate.has(edge.id)) {
          return {
            ...edge,
            hidden,
          };
        }
        return edge;
      });
    },
    []
  );

  // Helper function to find property target nodes and edges
  const findPropertyTargets = useCallback(
    (propKey: string, nodes: Node[], edges: Edge[]) => {
      // Find edges that connect this node to the property node
      const propertyEdges = edges.filter(
        (edge) =>
          edge.source === id &&
          (edge.sourceHandle === propKey ||
            edge.data?.key === propKey ||
            // Add specific handling for array indices
            (propKey.match(/^\d+$/) &&
              edge.data?.arrayIndex === parseInt(propKey)))
      );

      let targetIds = new Set<string>();
      let edgeIds = new Set<string>();

      // If we can't find edges by sourceHandle, try to find by target node label
      if (propertyEdges.length === 0) {
        // Get all direct child edges from this node
        const allChildEdges = getDirectChildEdges(id, edges);

        // For arrays with generic property keys like "prop-0", we need a different approach
        if (propKey.startsWith("prop-")) {
          // For arrays, we want to get ALL child nodes, not just the one at the index
          // This is because "prop-0" might be the collapse button for the entire array
          const currentNode = nodes.find((node) => node.id === id);

          // Check if this is an array node
          if (currentNode?.data?.type === "array") {
            // Get all direct children
            allChildEdges.forEach((edge) => {
              targetIds.add(edge.target);
              edgeIds.add(edge.id);
            });
          } else {
            // If not an array, use the original index-based approach
            const index = parseInt(propKey.split("-")[1]);

            // Get all direct children in order
            const childEdges = allChildEdges.sort((a, b) => {
              // Sort by array index if available
              const aIndex =
                a.data?.arrayIndex !== undefined ? a.data.arrayIndex : 0;
              const bIndex =
                b.data?.arrayIndex !== undefined ? b.data.arrayIndex : 0;
              return (aIndex as any) - (bIndex as any);
            });

            // Get the edge at the specified index
            if (index >= 0 && index < childEdges.length) {
              const targetEdge = childEdges[index];
              targetIds.add(targetEdge.target);
              edgeIds.add(targetEdge.id);
            }
          }
        } else {
          // Get all target nodes
          const targetNodeIds = allChildEdges.map((edge) => edge.target);
          const targetNodes = nodes.filter((node) =>
            targetNodeIds.includes(node.id)
          );

          // Find nodes that match the property key in their label
          const matchingNodes = targetNodes.filter((node: any) => {
            // For array indices, match exactly
            if (propKey.match(/^\d+$/) && node.data?.label === propKey) {
              return true;
            }

            // For array indices with additional info (e.g., "0 [3 items]")
            if (
              propKey.match(/^\d+$/) &&
              typeof node.data?.label === "string" &&
              node.data.label.startsWith(propKey + " ")
            ) {
              return true;
            }

            // For regular properties
            if (node.data?.label === propKey) {
              return true;
            }

            // For properties with additional info
            if (
              typeof node.data?.label === "string" &&
              node.data.label.startsWith(propKey + " ")
            ) {
              return true;
            }

            return false;
          });

          if (matchingNodes.length > 0) {
            targetIds = new Set(matchingNodes.map((node) => node.id));

            // Find edges that connect to these nodes
            const matchingEdges = edges.filter(
              (edge) => edge.source === id && targetIds.has(edge.target)
            );

            edgeIds = new Set(matchingEdges.map((edge) => edge.id));
          }
        }
      } else {
        targetIds = new Set(propertyEdges.map((edge) => edge.target));
        edgeIds = new Set(propertyEdges.map((edge) => edge.id));
      }

      return { targetIds, edgeIds };
    },
    [id, getDirectChildEdges]
  );

  // Find all ancestor nodes when hovering
  const highlightNodesAndEdges = useCallback(() => {
    // Skip highlighting during drag to improve performance
    if (isDragging || document.querySelector(".react-flow__node--dragging"))
      return;

    const nodes = getNodes();
    const edges = getEdges();

    // Start with the current node
    const nodesToHighlight = new Set([id]);
    const edgesToHighlight = new Set<string>();
    const pathEdges = new Set<string>(); // Edges in the path from root to hovered node

    // Find all ancestors by traversing edges backwards
    const currentNodes = [id];
    let foundNewNodes = true;

    // Track the path from root to the hovered node
    const nodeToParentMap = new Map<
      string,
      { nodeId: string; edgeId: string }
    >();

    // Keep finding ancestors until we can't find any more
    while (foundNewNodes) {
      foundNewNodes = false;

      // For each current node, find its incoming edges and their source nodes
      for (const nodeId of currentNodes) {
        const incomingEdges = edges.filter((edge) => edge.target === nodeId);

        for (const edge of incomingEdges) {
          // Add the edge to highlighted edges
          edgesToHighlight.add(edge.id);

          // If we haven't already processed this source node, add it
          if (!nodesToHighlight.has(edge.source)) {
            nodesToHighlight.add(edge.source);
            currentNodes.push(edge.source);
            foundNewNodes = true;

            // Track the parent relationship for path construction
            nodeToParentMap.set(nodeId, {
              nodeId: edge.source,
              edgeId: edge.id,
            });
          }
        }
      }
    }

    // Construct the path from root to hovered node
    let currentNodeId = id;
    while (nodeToParentMap.has(currentNodeId)) {
      const { edgeId } = nodeToParentMap.get(currentNodeId)!;
      pathEdges.add(edgeId);
      currentNodeId = nodeToParentMap.get(currentNodeId)!.nodeId;
    }

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      // Update nodes with highlight class
      setNodes(
        nodes.map((node) => ({
          ...node,
          className: nodesToHighlight.has(node.id) ? "highlight" : "",
        }))
      );

      // Update edges with highlight class and animated class for path edges
      setEdges(
        edges.map((edge) => ({
          ...edge,
          className: edgesToHighlight.has(edge.id)
            ? pathEdges.has(edge.id)
              ? "highlight animated-path"
              : "highlight"
            : "",
        }))
      );

      // Add dimmed class to the flow container
      toggleFlowElementClass(true, "dimmed");
    });
  }, [
    id,
    getNodes,
    getEdges,
    setNodes,
    setEdges,
    isDragging,
    toggleFlowElementClass,
  ]);

  // Reset highlighting when mouse leaves
  const resetHighlight = useCallback(() => {
    // Skip reset during drag to improve performance
    if (isDragging || document.querySelector(".react-flow__node--dragging"))
      return;

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      const nodes = getNodes();
      const edges = getEdges();

      // Remove all highlight classes
      setNodes(
        nodes.map((node) => ({
          ...node,
          className: "",
        }))
      );

      setEdges(
        edges.map((edge) => ({
          ...edge,
          className: "",
        }))
      );

      // Remove dimmed class from flow container
      toggleFlowElementClass(false, "dimmed");
    });
  }, [
    getNodes,
    getEdges,
    setNodes,
    setEdges,
    isDragging,
    toggleFlowElementClass,
  ]);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);

    // Remove any highlighting during drag
    resetHighlight();

    // Remove dimmed class from flow container
    toggleFlowElementClass(false, "dimmed");

    // Add a class to the node to indicate dragging
    const nodeElement = document.querySelector(`[data-id="${id}"]`);
    if (nodeElement) {
      nodeElement.classList.add("dragging");
    }
  }, [id, resetHighlight, setIsDragging, toggleFlowElementClass]);

  // Handle drag stop
  const handleDragStop = useCallback(() => {
    setIsDragging(false);

    // Remove dragging class
    const nodeElement = document.querySelector(`[data-id="${id}"]`);
    if (nodeElement) {
      nodeElement.classList.remove("dragging");
    }
  }, [id, setIsDragging]);

  // Check if this node has outgoing edges (children)
  const hasOutgoingEdges = useCallback(() => {
    const edges = getEdges();
    return edges.some((edge) => edge.source === id);
  }, [id, getEdges]); // Keep id in the dependency array as it's used in the function

  // Toggle collapse/expand function for the main node
  const toggleNodeCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const nodes = getNodes();
      const edges = getEdges();

      // Use the helper function to find ALL descendants
      const { descendantNodes, descendantEdges } = findAllDescendants(
        id,
        edges
      );

      // Toggle visibility of ALL descendant nodes and their edges
      setNodes(updateNodesVisibility(nodes, descendantNodes, !isNodeCollapsed));
      setEdges(updateEdgesVisibility(edges, descendantEdges, !isNodeCollapsed));

      setIsNodeCollapsed(!isNodeCollapsed);
    },
    [
      id,
      getNodes,
      getEdges,
      setNodes,
      setEdges,
      isNodeCollapsed,
      findAllDescendants,
      updateNodesVisibility,
      updateEdgesVisibility,
      setIsNodeCollapsed, // Add this missing dependency
    ]
  );

  // Toggle collapse/expand function for a specific property
  const togglePropertyCollapse = useCallback(
    (e: React.MouseEvent, propKey: string) => {
      e.stopPropagation(); // Prevent event from bubbling up

      const nodes = getNodes();
      const edges = getEdges();

      // Find property target nodes and edges
      const { targetIds, edgeIds } = findPropertyTargets(propKey, nodes, edges);

      // If we found target nodes, process them and their descendants
      if (targetIds.size > 0) {
        // Get the current collapse state for this property
        const isPropertyCollapsed = collapsedProperties[propKey] || false;

        // Process all descendants of the target nodes
        const processPropertyDescendants = () => {
          // For each target node, find all its descendants
          const allDescendantNodes = new Set<string>();
          const allDescendantEdges = new Set<string>();

          // Add the direct property nodes first
          targetIds.forEach((targetId) => {
            allDescendantNodes.add(targetId);

            // Then find all descendants of each property node
            const { descendantNodes, descendantEdges } = findAllDescendants(
              targetId,
              edges
            );

            // Add all descendants
            descendantNodes.forEach((id) => allDescendantNodes.add(id));
            descendantEdges.forEach((id) => allDescendantEdges.add(id));
          });

          // Add the direct edges
          edgeIds.forEach((id) => allDescendantEdges.add(id));

          return { allDescendantNodes, allDescendantEdges };
        };

        const { allDescendantNodes, allDescendantEdges } =
          processPropertyDescendants();

        // Toggle visibility of all descendant nodes
        setNodes(
          nodes.map((node) => {
            if (allDescendantNodes.has(node.id)) {
              return {
                ...node,
                hidden: !isPropertyCollapsed,
              };
            }
            return node;
          })
        );

        setEdges(
          edges.map((edge) => {
            if (allDescendantEdges.has(edge.id)) {
              return {
                ...edge,
                hidden: !isPropertyCollapsed,
              };
            }
            return edge;
          })
        );

        // Update the collapsed state for this specific property
        setCollapsedProperties((prev) => ({
          ...prev,
          [propKey]: !isPropertyCollapsed,
        }));
      }
    },
    [
      getNodes,
      getEdges,
      setNodes,
      setEdges,
      collapsedProperties,
      setCollapsedProperties,
      findAllDescendants,
      findPropertyTargets,
    ]
  );

  // Return the hooks interface
  return {
    highlightNodesAndEdges,
    resetHighlight,
    toggleNodeCollapse,
    togglePropertyCollapse,
    handleDragStart,
    handleDragStop,
    hasOutgoingEdges,
  };
};
