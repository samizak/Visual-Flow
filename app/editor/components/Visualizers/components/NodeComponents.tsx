import React from "react";

// Collapse/Expand button component
interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const CollapseButton: React.FC<CollapseButtonProps> = ({
  isCollapsed,
  onClick,
}) => {
  return (
    <button
      className="collapse-toggle-button"
      onClick={onClick}
      title={isCollapsed ? "Expand" : "Collapse"}
    >
      {isCollapsed ? "+" : "−"}
    </button>
  );
};

interface PropertyCollapseButtonProps {
  isCollapsed: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const PropertyCollapseButton: React.FC<PropertyCollapseButtonProps> = ({
  isCollapsed,
  onClick,
}) => {
  return (
    <button
      className="collapse-toggle-button-inline"
      onClick={onClick}
      title={isCollapsed ? "Expand" : "Collapse"}
    >
      {isCollapsed ? "+" : "−"}
    </button>
  );
};
