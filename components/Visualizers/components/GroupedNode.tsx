import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { getTypeColor, getValueClass, isCollapsible } from "../utils/nodeUtils";
import {
  LinkIcon,
  CollapseButton,
  PropertyCollapseButton,
} from "./NodeComponents";
import { useNodeInteractions } from "../hooks/useNodeInteractions";

interface GroupedNodeData {
  label: string;
  type: string;
  properties: Array<{ key: string; value: string }>;
  hasChildren?: boolean;
}

const GroupedNode = memo(({ data, id }: NodeProps) => {
  const nodeData = data as unknown as GroupedNodeData;
  const { label, type, properties, hasChildren } = nodeData;
  const [isDragging, setIsDragging] = useState(false);
  const [isNodeCollapsed, setIsNodeCollapsed] = useState(false);
  const [collapsedProperties, setCollapsedProperties] = useState<
    Record<string, boolean>
  >({});

  // Get the background color for the node
  const backgroundColor = getTypeColor(type);

  // Use the custom hook for node interactions
  const {
    highlightNodesAndEdges,
    resetHighlight,
    toggleNodeCollapse,
    togglePropertyCollapse,
    handleDragStart,
    handleDragStop,
    hasOutgoingEdges,
  } = useNodeInteractions(
    id,
    isDragging,
    setIsDragging,
    isNodeCollapsed,
    setIsNodeCollapsed,
    collapsedProperties,
    setCollapsedProperties,
    hasChildren
  );

  return (
    <div
      className="grouped-node"
      data-type={type}
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
        style={{
          borderColor: backgroundColor,
          width: "100%",
          height: "100%",
        }}
      >
        <div
          className="grouped-node-header"
          style={{
            backgroundColor,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            fontWeight: 500,
            letterSpacing: "0.3px",
            transition: "background-color 0.2s ease",
            fontSize: "13px",
            width: "100%",
          }}
        >
          <span>{label}</span>
          {hasOutgoingEdges() && (
            <div
              className="node-action-button cursor-pointer"
              onClick={toggleNodeCollapse}
              title={isNodeCollapsed ? "Expand All" : "Collapse All"}
              style={{ padding: "2px 6px" }}
            >
              <LinkIcon />
            </div>
          )}
        </div>
        <div
          className="grouped-node-content"
          style={{ padding: 0, width: "100%", height: "100%" }}
        >
          {properties.map((prop, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                flex: "1 1 auto",
              }}
            >
              <div
                className="grouped-node-property"
                style={{
                  backgroundColor: isCollapsible(prop.value)
                    ? "rgba(255, 255, 255, 0.03)"
                    : "transparent",
                  padding: "8px 12px",
                  width: "100%",
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <div className="property-content" style={{ flex: 1 }}>
                  {prop.key && (
                    <span className="grouped-node-key">{prop.key}</span>
                  )}
                  {prop.key && prop.value && (
                    <span className="grouped-node-separator">: </span>
                  )}
                  {prop.value && (
                    <span
                      className={`grouped-node-value ${getValueClass(
                        prop.value
                      )}`}
                    >
                      {prop.value}
                    </span>
                  )}
                </div>
                <div className="property-actions">
                  {isCollapsible(prop.value) && (
                    <PropertyCollapseButton
                      isCollapsed={
                        collapsedProperties[prop.key || `prop-${index}`] ||
                        false
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePropertyCollapse(e, prop.key || `prop-${index}`);
                      }}
                    />
                  )}
                </div>
              </div>
              {index < properties.length - 1 && (
                <div
                  className="property-separator"
                  style={{
                    height: "1px",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    width: "100%",
                  }}
                />
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
