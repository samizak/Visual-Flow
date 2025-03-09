import { memo, useCallback, useState } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";

interface GroupedNodeData {
  label: string;
  type: string;
  properties: Array<{ key: string; value: string }>;
  hasChildren?: boolean; // Add this property to indicate if the node has children
}

const GroupedNode = memo(({ data, id }: NodeProps) => {
  const nodeData = data as unknown as GroupedNodeData;
  const { label, type, properties, hasChildren } = nodeData;
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Add state for collapse/expand

  // Get color based on type
  const getTypeColor = (type: string) => {
    const colors = {
      object: "#3a506b", // Blue-gray
      array: "#b87333", // Orange
    };

    return colors[type as keyof typeof colors] || "#607d8b";
  };

  // Add this function to determine the CSS class based on value
  const getValueClass = (value: string): string => {
    // Check if it's a number
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return "grouped-node-value-number";
    }
    // Check if it's a boolean
    else if (value === "true" || value === "false") {
      return "grouped-node-value-boolean";
    }
    // Check if it's null
    else if (value === "null") {
      return "grouped-node-value-null";
    }
    // Check if it's an array
    else if (value.startsWith("[") && value.endsWith("]")) {
      return "grouped-node-value-array";
    }
    // Check if it's an object with key count (both singular and plural forms)
    else if (
      value.startsWith("{") &&
      (value.includes(" keys}") || value.includes(" key}"))
    ) {
      return "grouped-node-value-object";
    }
    // Check if it's an object (old format)
    else if (value === "{...}") {
      return "grouped-node-value-object";
    }
    // Default for strings (has quotes)
    else if (value.startsWith('"') && value.endsWith('"')) {
      return "grouped-node-value";
    }
    // Fallback
    return "grouped-node-value";
  };

  const backgroundColor = getTypeColor(type);

  // Find all ancestor nodes when hovering
  const highlightNodesAndEdges = useCallback(() => {
    // Skip highlighting during drag to improve performance
    if (isDragging) return;

    const nodes = getNodes();
    const edges = getEdges();

    // Start with the current node
    const nodesToHighlight = new Set([id]);
    const edgesToHighlight = new Set<string>();

    // Find all ancestors by traversing edges backwards
    let currentNodes = [id];
    let foundNewNodes = true;

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
          }
        }
      }
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

      // Update edges with highlight class
      setEdges(
        edges.map((edge) => ({
          ...edge,
          className: edgesToHighlight.has(edge.id) ? "highlight" : "",
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
    if (isDragging) return;

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

    // Add a class to the node to indicate dragging
    const nodeElement = document.querySelector(`[data-id="${id}"]`);
    if (nodeElement) {
      nodeElement.classList.add("dragging");
    }
  }, [id, resetHighlight]);

  // Handle drag stop
  const handleDragStop = useCallback(() => {
    setIsDragging(false);

    // Remove dragging class
    const nodeElement = document.querySelector(`[data-id="${id}"]`);
    if (nodeElement) {
      nodeElement.classList.remove("dragging");
    }
  }, [id]);

  // Link SVG icon component
  const LinkIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="link-icon"
      style={{ marginLeft: "6px", verticalAlign: "middle" }}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  );

  // Check if this node has outgoing edges (children)
  const hasOutgoingEdges = useCallback(() => {
    // If we already know from the data
    if (hasChildren !== undefined) return hasChildren;

    // Otherwise check the edges
    const edges = getEdges();
    return edges.some((edge) => edge.source === id);
  }, [id, getEdges, hasChildren]);

  // Toggle collapse/expand function
  const toggleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent event from bubbling up

      const nodes = getNodes();
      const edges = getEdges();

      // Find all descendant nodes
      const descendants = new Set<string>();
      const edgesToToggle = new Set<string>();

      // Start with direct children
      let currentLevel = [id];
      let hasMore = true;

      while (hasMore && currentLevel.length > 0) {
        const nextLevel: string[] = [];
        hasMore = false;

        // For each node in current level
        for (const nodeId of currentLevel) {
          // Skip the root node (only process children)
          if (nodeId === id) continue;

          // Find outgoing edges from this node
          const outgoingEdges = edges.filter((edge) => edge.source === nodeId);

          for (const edge of outgoingEdges) {
            edgesToToggle.add(edge.id);

            if (!descendants.has(edge.target)) {
              descendants.add(edge.target);
              nextLevel.push(edge.target);
              hasMore = true;
            }
          }
        }

        // Add direct children of the root node
        if (currentLevel[0] === id) {
          const directChildren = edges
            .filter((edge) => edge.source === id)
            .map((edge) => {
              edgesToToggle.add(edge.id);
              return edge.target;
            });

          for (const child of directChildren) {
            if (!descendants.has(child)) {
              descendants.add(child);
              nextLevel.push(child);
              hasMore = true;
            }
          }
        }

        currentLevel = nextLevel;
      }

      // Toggle visibility of descendant nodes and their edges
      setNodes(
        nodes.map((node) => {
          if (descendants.has(node.id)) {
            return {
              ...node,
              hidden: !isCollapsed,
            };
          }
          return node;
        })
      );

      setEdges(
        edges.map((edge) => {
          if (edgesToToggle.has(edge.id)) {
            return {
              ...edge,
              hidden: !isCollapsed,
            };
          }
          return edge;
        })
      );

      setIsCollapsed(!isCollapsed);
    },
    [id, getNodes, getEdges, setNodes, setEdges, isCollapsed]
  );

  // Collapse/Expand button component
  const CollapseButton = () => {
    if ((type === "array" || type === "object") && hasOutgoingEdges()) {
      return (
        <button
          className="collapse-toggle-button"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "+" : "−"}
        </button>
      );
    }
    return null;
  };

  return (
    <div
      className="grouped-node"
      onMouseEnter={highlightNodesAndEdges}
      onMouseLeave={resetHighlight}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragStop}
      style={{
        willChange: "transform",
        transform: "translate3d(0,0,0)", // Force GPU acceleration
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div
        className="grouped-node-container my-4"
        style={{ borderColor: backgroundColor }}
      >
        <div
          className="grouped-node-header"
          style={{
            backgroundColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
          }}
        >
          <span>{label}</span>
          {hasOutgoingEdges() && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "1px",
                  height: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  marginRight: "8px",
                }}
              />
              <LinkIcon />
            </div>
          )}
        </div>
        <div className="grouped-node-content">
          {properties.map((prop, index) => (
            <div key={index} className="grouped-node-property">
              {prop.key && <span className="grouped-node-key">{prop.key}</span>}
              {prop.key && prop.value && (
                <span className="grouped-node-separator">: </span>
              )}
              <div className="property-value-container">
                {prop.value && (
                  <span
                    className={`grouped-node-value ${getValueClass(
                      prop.value
                    )}`}
                  >
                    {prop.value}
                  </span>
                )}
                {(prop.value?.includes(" keys}") || 
                  prop.value?.includes(" key}") ||
                  prop.value?.includes(" items]") ||
                  prop.value?.includes(" item]")) && (
                  <button
                    className="collapse-toggle-button-inline"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCollapse(e);
                    }}
                    title={isCollapsed ? "Expand" : "Collapse"}
                  >
                    {isCollapsed ? "+" : "−"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

export default GroupedNode;
