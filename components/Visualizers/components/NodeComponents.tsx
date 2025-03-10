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

// Root node SVG icon
export const RootIcon: React.FC = () => (
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
    className="mr-2"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

// Object node SVG icon
export const ObjectIcon: React.FC = () => (
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
    className="mr-2"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
    <line x1="15" y1="3" x2="15" y2="21"></line>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="3" y1="15" x2="21" y2="15"></line>
  </svg>
);

// Array node SVG icon
export const ArrayIcon: React.FC = () => (
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
    className="mr-2"
  >
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// Add this new primitive icon component
export const PrimitiveIcon: React.FC = () => (
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
    className="mr-2"
  >
    <path d="M20 7h-3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3"></path>
    <path d="M14 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10"></path>
    <line x1="12" y1="7" x2="12" y2="19"></line>
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
