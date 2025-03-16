// Define free user limits in a single location
export const FREE_LIMITS = {
  MAX_LINES: 50,
  MAX_NODES: 5,
  MAX_DEPTH: 2,
  MAX_SIZE_KB: 1,
};

// Helper functions for JSON validation
export const countJsonLines = (json: string): number => {
  return json.split("\n").length;
};

export const countJsonNodes = (obj: any): number => {
  let count = 1; // Count the root node

  if (typeof obj !== "object" || obj === null) {
    return 1;
  }

  // For arrays, count each item
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        count += countJsonNodes(item);
      } else {
        count += 1;
      }
    });
  } else {
    // For objects, count each property
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        count += countJsonNodes(obj[key]);
      } else {
        count += 1;
      }
    });
  }

  return count;
};

export const getJsonDepth = (obj: any): number => {
  if (typeof obj !== "object" || obj === null) {
    return 0;
  }

  let maxDepth = 0;

  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        const depth = getJsonDepth(item);
        maxDepth = Math.max(maxDepth, depth);
      }
    });
  } else {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        const depth = getJsonDepth(obj[key]);
        maxDepth = Math.max(maxDepth, depth);
      }
    });
  }

  return maxDepth + 1;
};

// Shared validation function to check JSON against free user limits
export const validateJsonAgainstFreeLimits = (
  jsonContent: string,
  isPremiumUser: boolean = false
): {
  isValid: boolean;
  message?: string;
  details?: { lines: number; nodes: number; depth: number; size: number };
  isFormatError?: boolean;
} => {
  // Premium users bypass all checks - ensure this is the first check
  // Add explicit logging and strict equality check
  if (isPremiumUser === true) {
    return { isValid: true };
  }

  try {
    // Parse the JSON to validate it
    const parsedJson = JSON.parse(jsonContent);

    // Calculate all metrics at once
    const lines = countJsonLines(jsonContent);
    const nodes = countJsonNodes(parsedJson);
    const depth = getJsonDepth(parsedJson);
    const sizeKB = new Blob([jsonContent]).size / 1024;

    const details = { lines, nodes, depth, size: sizeKB };

    // Check against each limit
    if (sizeKB > FREE_LIMITS.MAX_SIZE_KB) {
      return {
        isValid: false,
        message: `File size (${sizeKB.toFixed(1)}KB) exceeds free limit (${
          FREE_LIMITS.MAX_SIZE_KB
        }KB)`,
        details,
      };
    }

    if (lines > FREE_LIMITS.MAX_LINES) {
      return {
        isValid: false,
        message: `Line count (${lines}) exceeds free limit (${FREE_LIMITS.MAX_LINES})`,
        details,
      };
    }

    if (nodes > FREE_LIMITS.MAX_NODES) {
      return {
        isValid: false,
        message: `Node count (${nodes}) exceeds free limit (${FREE_LIMITS.MAX_NODES})`,
        details,
      };
    }

    if (depth > FREE_LIMITS.MAX_DEPTH) {
      return {
        isValid: false,
        message: `JSON depth (${depth}) exceeds free limit (${FREE_LIMITS.MAX_DEPTH})`,
        details,
      };
    }

    // All checks passed
    return { isValid: true, details };
  } catch (e) {
    // Mark this as a format error, not a limits error
    return {
      isValid: false,
      message: "Invalid JSON format",
      isFormatError: true,
    };
  }
};

// Generate a comprehensive message about limit violations
export const generateLimitsExceededMessage = (details: {
  lines: number;
  nodes: number;
  depth: number;
  size: number;
}): string => {
  let message = "Free plan limits exceeded. ";

  if (details.lines > FREE_LIMITS.MAX_LINES)
    message += `Lines: ${details.lines}/${FREE_LIMITS.MAX_LINES}. `;

  if (details.nodes > FREE_LIMITS.MAX_NODES)
    message += `Nodes: ${details.nodes}/${FREE_LIMITS.MAX_NODES}. `;

  if (details.depth > FREE_LIMITS.MAX_DEPTH)
    message += `Depth: ${details.depth}/${FREE_LIMITS.MAX_DEPTH}. `;

  if (details.size > FREE_LIMITS.MAX_SIZE_KB)
    message += `Size: ${details.size.toFixed(1)}KB/${
      FREE_LIMITS.MAX_SIZE_KB
    }KB. `;

  message += "Upgrade for more!";

  return message;
};
