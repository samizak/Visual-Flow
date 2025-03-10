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

// Helper function to find direct children of a node
const findDirectChildren = (
  nodeId: string,
  edges: Edge[]
): { directChildren: Set<string>; directEdges: Set<string> } => {
  const directChildren = new Set<string>();
  const directEdges = new Set<string>();

  // Find direct children edges
  const childEdges = edges.filter((edge) => edge.source === nodeId);

  // Add direct children to the set
  childEdges.forEach((edge) => {
    directChildren.add(edge.target);
    directEdges.add(edge.id);
  });

  return { directChildren, directEdges };
};

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
    let currentNodes = [id];
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
      const flowElement = document.querySelector(".react-flow");
      if (flowElement) {
        flowElement.classList.add("dimmed");
      }
    });
  }, [id, getNodes, getEdges, setNodes, setEdges, isDragging]);

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
      const flowElement = document.querySelector(".react-flow");
      if (flowElement) {
        flowElement.classList.remove("dimmed");
      }
    });
  }, [getNodes, getEdges, setNodes, setEdges, isDragging]);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);

    // Remove any highlighting during drag
    resetHighlight();

    // Remove dimmed class from flow container
    const flowElement = document.querySelector(".react-flow");
    if (flowElement) {
      flowElement.classList.remove("dimmed");
    }

    // Add a class to the node to indicate dragging
    const nodeElement = document.querySelector(`[data-id="${id}"]`);
    if (nodeElement) {
      nodeElement.classList.add("dragging");
    }
  }, [id, resetHighlight, setIsDragging]);

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
    // If we already know from the data
    if (hasChildren !== undefined) return hasChildren;

    // Otherwise check the edges
    const edges = getEdges();
    return edges.some((edge) => edge.source === id);
  }, [id, getEdges, hasChildren]);

  // Toggle collapse/expand function for the main node
  const toggleNodeCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent event from bubbling up

      const nodes = getNodes();
      const edges = getEdges();

      // Use the helper function to find ALL descendants
      const { descendantNodes, descendantEdges } = findAllDescendants(
        id,
        edges
      );

      // console.log(
      //   `Node ${id} has ${descendantNodes.size} descendant nodes and ${descendantEdges.size} descendant edges`
      // );

      // Toggle visibility of ALL descendant nodes and their edges
      setNodes(
        nodes.map((node) => {
          // Modify all descendant nodes
          if (descendantNodes.has(node.id)) {
            return {
              ...node,
              hidden: !isNodeCollapsed,
            };
          }
          // Don't change other nodes
          return node;
        })
      );

      setEdges(
        edges.map((edge) => {
          // Modify all descendant edges
          if (descendantEdges.has(edge.id)) {
            return {
              ...edge,
              hidden: !isNodeCollapsed,
            };
          }
          // Don't change other edges
          return edge;
        })
      );

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
    ]
  );

  // Toggle collapse/expand function for a specific property
  const togglePropertyCollapse = useCallback(
    (e: React.MouseEvent, propKey: string) => {
      e.stopPropagation(); // Prevent event from bubbling up

      const nodes = getNodes();
      const edges = getEdges();

      // Find edges that connect this node to the property node
      const propertyEdges = edges.filter(
        (edge) =>
          edge.source === id &&
          (edge.sourceHandle === propKey || edge.data?.key === propKey)
      );

      let targetIds = new Set<string>();
      let edgeIds = new Set<string>();

      // If we can't find edges by sourceHandle, try to find by target node label
      if (propertyEdges.length === 0) {
        const allChildEdges = edges.filter((edge) => edge.source === id);

        // Get all target nodes
        const targetNodeIds = allChildEdges.map((edge) => edge.target);
        const targetNodes = nodes.filter((node) =>
          targetNodeIds.includes(node.id)
        );

        // Find nodes that match the property key in their label
        const matchingNodes = targetNodes.filter(
          (node) =>
            node.data?.label === propKey ||
            (typeof node.data?.label === "string" &&
              node.data?.label.startsWith(propKey + " "))
        );

        if (matchingNodes.length > 0) {
          targetIds = new Set(matchingNodes.map((node) => node.id));

          // Find edges that connect to these nodes
          const matchingEdges = edges.filter(
            (edge) => edge.source === id && targetIds.has(edge.target)
          );

          edgeIds = new Set(matchingEdges.map((edge) => edge.id));
        }
      } else {
        // We found edges by sourceHandle
        targetIds = new Set(propertyEdges.map((edge) => edge.target));
        edgeIds = new Set(propertyEdges.map((edge) => edge.id));
      }

      // If we found target nodes, process them and their descendants
      if (targetIds.size > 0) {
        // Get the current collapse state for this property
        const isPropertyCollapsed = collapsedProperties[propKey] || false;

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

        // console.log(
        //   `Property ${propKey} has ${allDescendantNodes.size} descendant nodes and ${allDescendantEdges.size} descendant edges`
        // );

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
      id,
      getNodes,
      getEdges,
      setNodes,
      setEdges,
      collapsedProperties,
      setCollapsedProperties,
      findAllDescendants,
    ]
  );

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
