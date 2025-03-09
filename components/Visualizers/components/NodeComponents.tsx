import React from "react";

// Link SVG icon component
export const LinkIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="link-icon"
    style={{ verticalAlign: "middle" }}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

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

// Property collapse button
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
