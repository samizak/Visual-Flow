import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

interface GroupedNodeData {
  label: string;
  type: string;
  properties: Array<{ key: string; value: string }>;
}

const GroupedNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as GroupedNodeData;
  const { label, type, properties } = nodeData;

  // Get color based on type
  const getTypeColor = (type: string) => {
    const colors = {
      object: "#3a506b", // Blue-gray
      array: "#b87333", // Orange
    };

    console.log(type, properties);

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
              {prop.key && <span className="grouped-node-key">{prop.key}</span>}
              {prop.key && prop.value && (
                <span className="grouped-node-separator">: </span>
              )}
              {prop.value && (
                <span className="grouped-node-value">{prop.value}</span>
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
