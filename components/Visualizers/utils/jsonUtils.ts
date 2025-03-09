// Helper function to get the type of a value
export const getValueType = (value: any): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
};

// Helper function to get display value with improved representation
export const getDisplayValue = (value: any, type: string): string => {
  if (type === "object") {
    if (value === null) return "null";
    return "{...}";
  }
  if (type === "array") return `[${value.length}]`;
  if (type === "string") return `"${value}"`;
  if (type === "boolean") return String(value); // Ensure booleans are preserved as-is
  if (type === "number") return String(value); // Ensure numbers are preserved as-is
  if (type === "null") return "null";
  return String(value);
};

// Constants for node dimensions and spacing
export const NODE_WIDTH = 250;
export const NODE_HEIGHT = 150;
export const NODE_MARGIN = 30;