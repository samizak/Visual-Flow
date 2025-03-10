// Helper function to get the type of a value
export const getValueType = (value: any): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
};

// Helper function to get display value with improved representation
export function getDisplayValue(value: any, type: string): string {
  switch (type) {
    case "string":
      return `"${value}"`;
    case "number":
    case "boolean":
      return String(value);
    case "null":
      return "null";
    case "array":
      return `[${(value as any[]).length}]`;
    case "object":
      // Count the number of keys in the object
      const keyCount = Object.keys(value).length;
      return `{${keyCount} ${keyCount === 1 ? "key" : "keys"}}`;
    default:
      return String(value);
  }
}

// Constants for node dimensions and spacing
export const NODE_WIDTH = 350;
export const NODE_HEIGHT = 150;
export const NODE_MARGIN = 30;
