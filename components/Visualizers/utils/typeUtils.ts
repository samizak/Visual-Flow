import { NodeTypeColors } from "../types/jsonFlowTypes";

// Define node types and their colors
export const nodeTypes: NodeTypeColors = {
  string: "#4caf50", // Green
  number: "#2196f3", // Blue
  boolean: "#ff9800", // Orange
  object: "#9c27b0", // Purple
  array: "#e91e63", // Pink
  null: "#607d8b", // Gray
};

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
    // Try to find a meaningful identifier
    const identifiers = ["name", "id", "title", "key"];
    for (const id of identifiers) {
      if (value[id] !== undefined) {
        return `{${id}: ${typeof value[id] === "string" ? `"${value[id]}"` : value[id]}, ...}`;
      }
    }
    return "{...}";
  }
  if (type === "array") return `[${value.length}]`;
  if (type === "string") return `"${value}"`;
  if (type === "null") return "null";
  return String(value);
};

// Add new function to create split labels
export const createSplitLabel = (key: string, value: any, type: string): { top: string, bottom: string } => {
  const displayValue = getDisplayValue(value, type);
  return {
    top: key ? `${key}: ${displayValue}` : displayValue,
    bottom: type.charAt(0).toUpperCase() + type.slice(1) // Capitalize type
  };
};

// Helper function to check if an array contains objects
export const isArrayOfObjects = (arr: any[]): boolean => {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.some(
      (item) =>
        item !== null && typeof item === "object" && !Array.isArray(item)
    )
  );
};

// Helper function to get a meaningful name for an object in an array
export const getObjectName = (obj: any, index: number): string => {
  const identifiers = ["name", "id", "title", "key"];
  for (const id of identifiers) {
    if (obj[id] !== undefined) {
      const value = obj[id];
      return `[${index}]: ${typeof value === "string" ? `"${value}"` : value}`;
    }
  }
  return `[${index}]: {...}`;
};
