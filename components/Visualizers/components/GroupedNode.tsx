import { memo, useCallback, useState } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";

interface GroupedNodeData {
  label: string;
  type: string;
  properties: Array<{ key: string; value: string }>;
}

const GroupedNode = memo(({ data, id }: NodeProps) => {
  const nodeData = data as unknown as GroupedNodeData;
  const { label, type, properties } = nodeData;
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);

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
    // Check if it's an object
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

  // New function to get value text color based on data type
  const getValueTextColor = (value: string): string => {
    // Check if it's a number
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      return "#b5cea8"; // Light green for numbers
    }
    // Check if it's a string (has quotes)
    else if (value.startsWith('"') && value.endsWith('"')) {
      return "#ce9178"; // Keep current orange-ish for strings
    }
    // Check if it's a boolean
    else if (value === "true" || value === "false") {
      return "#569cd6"; // Blue for booleans
    }
    // Check if it's null
    else if (value === "null") {
      return "#d7ba7d"; // Gold/yellow for null
    }
    // Check if it's an array
    else if (value.startsWith("[") && value.endsWith("]")) {
      return "#d7ba7d"; // Gold/yellow for arrays
    }
    // Check if it's an object
    else if (value === "{...}") {
      return "#4ec9b0"; // Teal for objects
    }
    // Default color
    return "#e0e0e0"; // Light gray default
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
        const incomingEdges = edges.filter(edge => edge.target === nodeId);
        
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
      setNodes(nodes.map(node => ({
        ...node,
        className: nodesToHighlight.has(node.id) ? 'highlight' : ''
      })));
      
      // Update edges with highlight class
      setEdges(edges.map(edge => ({
        ...edge,
        className: edgesToHighlight.has(edge.id) ? 'highlight' : ''
      })));
      
      // Add dimmed class to the flow container
      const flowElement = document.querySelector('.react-flow');
      if (flowElement) {
        flowElement.classList.add('dimmed');
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
      setNodes(nodes.map(node => ({
        ...node,
        className: ''
      })));
      
      setEdges(edges.map(edge => ({
        ...edge,
        className: ''
      })));
      
      // Remove dimmed class from flow container
      const flowElement = document.querySelector('.react-flow');
      if (flowElement) {
        flowElement.classList.remove('dimmed');
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
      nodeElement.classList.add('dragging');
    }
  }, [id, resetHighlight]);

  // Handle drag stop
  const handleDragStop = useCallback(() => {
    setIsDragging(false);
    
    // Remove dragging class
    const nodeElement = document.querySelector(`[data-id="${id}"]`);
    if (nodeElement) {
      nodeElement.classList.remove('dragging');
    }
  }, [id]);

  return (
    <div 
      className="grouped-node"
      onMouseEnter={highlightNodesAndEdges}
      onMouseLeave={resetHighlight}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragStop}
      style={{ 
        willChange: 'transform',
        transform: 'translate3d(0,0,0)' // Force GPU acceleration
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div
        className="grouped-node-container my-4"
        style={{ borderColor: backgroundColor }}
      >
        <div className="grouped-node-header" style={{ backgroundColor }}>
          {label}
        </div>
        <div className="grouped-node-content">
          {properties.map((prop, index) => (
            <div key={index} className="grouped-node-property">
              {prop.key && <span className="grouped-node-key">{prop.key}</span>}
              {prop.key && prop.value && (
                <span className="grouped-node-separator">: </span>
              )}
              {prop.value && (
                <span className={`grouped-node-value ${getValueClass(prop.value)}`}>
                  {prop.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

export default GroupedNode;
