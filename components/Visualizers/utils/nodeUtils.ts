// Utility functions for node styling and classification

// Get color based on node type
export const getTypeColor = (type: string): string => {
  console.log(`Getting color for type: ${type}`);

  const colors = {
    object: "#3a506b", // Blue-gray
    array: "#b87333", // Orange
    primitive: "#2e7d32", // Modern dark green for primitives
    root: "#6b46c1", // Modern dark purple for root node (updated)
  };

  // Add fallback logic to ensure we always return a color
  const color = colors[type as keyof typeof colors] || colors.primitive;
  console.log(`Selected color for type ${type}: ${color}`);
  return color;
};

// Determine the CSS class based on value
export const getValueClass = (value: string): string => {
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

// Check if a value represents a collapsible structure
export const isCollapsible = (value: string): boolean => {
  return (
    value?.includes(" keys}") ||
    value?.includes(" key}") ||
    value?.includes(" items]") ||
    value?.includes(" item]")
  );
};
