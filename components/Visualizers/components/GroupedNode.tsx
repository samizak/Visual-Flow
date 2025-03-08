import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

interface GroupedNodeData {
  label: string;
  type: string;
  properties: Array<{ key: string; value: string }>;
}

const GroupedNode = memo(({ data }: NodeProps) => {
  // Use type assertion with unknown first to avoid direct conversion error
  const nodeData = data as unknown as GroupedNodeData;
  const { label, type, properties } = nodeData;

  // Get color based on type
  const getTypeColor = (type: string) => {
    const colors = {
      string: "#4caf50", // Green
      number: "#2196f3", // Blue
      boolean: "#ff9800", // Orange
      object: "#9c27b0", // Purple
      array: "#e91e63", // Pink
      null: "#607d8b", // Gray
    };

    return colors[type as keyof typeof colors] || "#607d8b";
  };

  const backgroundColor = getTypeColor(type);

  return (
    <div className="grouped-node">
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
              <span className="grouped-node-key">{prop.key}</span>
              {prop.value && (
                <>
                  <span className="grouped-node-separator">: </span>
                  <span className="grouped-node-value">{prop.value}</span>
                </>
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
