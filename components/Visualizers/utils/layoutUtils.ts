// Helper function to calculate JSON size (depth and breadth)
export const calculateJsonSize = (data: any): number => {
  if (data === null || typeof data !== "object") {
    return 1;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return 1;
    return (
      Math.max(...data.map((item) => calculateJsonSize(item))) + data.length
    );
  }

  const keys = Object.keys(data);
  if (keys.length === 0) return 1;

  return (
    Math.max(...keys.map((key) => calculateJsonSize(data[key]))) + keys.length
  );
};

// Calculate spacing based on JSON size
export const calculateSpacing = (jsonSize: number) => {
  const horizontalSpacing = Math.max(300, Math.min(500, 250 + jsonSize * 12));
  const verticalSpacing = Math.max(80, Math.min(180, 70 + jsonSize * 6));
  
  return { horizontalSpacing, verticalSpacing };
};