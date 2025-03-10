import { memo, useState, useMemo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { getTypeColor, getValueClass, isCollapsible } from "../utils/nodeUtils";
import {
  LinkIcon,
  CollapseButton,
  PropertyCollapseButton,
  PrimitiveIcon, // Import the new PrimitiveIcon
} from "./NodeComponents";
import { useNodeInteractions } from "../hooks/useNodeInteractions";
import { Braces, Brackets, Box, Type, Hash, ToggleLeft, X } from "lucide-react";

interface GroupedNodeData {
  label: string;
  type: string;
  properties: Array<{ key: string; value: string }>;
  hasChildren?: boolean;
}

const GroupedNode = memo(
  ({ data, id, isVisible = true }: NodeProps & { isVisible?: boolean }) => {
    const nodeData = data as unknown as GroupedNodeData;
    const { label, type, properties, hasChildren } = nodeData;

    const [isDragging, setIsDragging] = useState(false);
    const [isNodeCollapsed, setIsNodeCollapsed] = useState(false);
    const [collapsedProperties, setCollapsedProperties] = useState<
      Record<string, boolean>
    >({});

    // Memoize the background color to prevent recalculation
    const backgroundColor = useMemo(() => getTypeColor(type), [type]);

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

    // Render the appropriate icon based on node type
    const renderNodeIcon = () => {
      if (label === "Root") {
        return <Box className="mr-2" size={18} />;
      } else if (type === "object") {
        return <Braces className="mr-2" size={18} />;
      } else if (type === "array") {
        return <Brackets className="mr-2" size={18} />;
      } else if (
        type === "primitive" ||
        type === "string" ||
        type === "number" ||
        type === "boolean" ||
        type === "null"
      ) {
        return <Type className="mr-2" size={18} />;
      }
      return null;
    };

    // Only memoize the node content if the node is visible
    const nodeContent = useMemo(() => {
      // Skip rendering complex content if not visible
      if (!isVisible)
        return <div className="grouped-node-content-placeholder"></div>;

      return (
        <div className="grouped-node-content">
          {properties.map((prop, index) => (
            <div key={index} className="property-wrapper">
              <div
                className={`grouped-node-property ${
                  isCollapsible(prop.value) ? "collapsible" : ""
                }`}
              >
                <div className="property-content truncate max-w-[300px]">
                  {prop.key && (
                    <span
                      className="grouped-node-key truncate max-w-[300px]"
                      title={prop.key}
                    >
                      {prop.key}
                    </span>
                  )}
                  {prop.key && prop.value && (
                    <span className="grouped-node-separator">: </span>
                  )}
                  {prop.value && (
                    <span
                      className={`grouped-node-value truncate max-w-[300px] ${getValueClass(
                        prop.value
                      )}`}
                      title={prop.value}
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
                <div className="property-separator" />
              )}
            </div>
          ))}
        </div>
      );
    }, [properties, collapsedProperties, togglePropertyCollapse, isVisible]);

    return (
      <div
        className="grouped-node"
        data-type={label === "Root" ? "root" : type}
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
            borderColor: label === "Root" ? "#9370DB" : backgroundColor,
          }}
        >
          <div
            className="grouped-node-header font-medium tracking-tight"
            style={{ backgroundColor: label !== "Root" ? backgroundColor : "" }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">{renderNodeIcon()}</div>
              <span className="flex-grow text-center font-geist-sans">
                {label}
              </span>
              <div className="flex items-center">
                {hasOutgoingEdges() && (
                  <div
                    className="node-action-button cursor-pointer"
                    onClick={toggleNodeCollapse}
                    title={isNodeCollapsed ? "Expand All" : "Collapse All"}
                  >
                    <LinkIcon />
                  </div>
                )}
                {!hasOutgoingEdges() && <div className="w-5"></div>}
              </div>
            </div>
          </div>
          {nodeContent}
        </div>
        <Handle type="source" position={Position.Right} />
      </div>
    );
  }
);

export default GroupedNode;
