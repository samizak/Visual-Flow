import { memo } from "react";
import { Handle, Position } from "reactflow";

interface CustomNodeProps {
  data: {
    label: {
      top: string;
      bottom: string;
    };
  };
}

const CustomNode = memo(({ data }: CustomNodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="custom-node">
        <div className="custom-node-top">{data.label.top}</div>
        <div className="custom-node-bottom">{data.label.bottom}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
});

export default CustomNode;
