import React from "react";
import JsonFlowChart from "../Visualizers/JsonFlowChart";
import { useJsonStore } from "../../store/useJsonStore";

export default function RightPanel() {
  // Use the Zustand store instead of props
  const {
    visualizationJson,
    isValidJson,
    setNodeCount,
    nodeCount,
    edgeType,
    showGrid,
    setShowGrid
  } = useJsonStore();

  // Check if we have valid JSON data to visualize
  const hasValidVisualizationData = isValidJson && !!visualizationJson;

  return (
    <div className="flex-1 h-full overflow-hidden bg-[#1e1e1e]">
      {hasValidVisualizationData ? (
        <JsonFlowChart
          jsonData={visualizationJson}
          isValidJson={hasValidVisualizationData}
          onNodeCountChange={setNodeCount}
          edgeType={edgeType}
          showGrid={showGrid}
        />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
          <div className="max-w-md text-center p-6">
            <h3 className="text-xl font-medium mb-2">No Valid JSON Data</h3>
            <p className="mb-4">
              Enter valid JSON in the editor panel to visualize it here.
            </p>
            <div className="text-sm opacity-70">
              <p>You can:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                <li>Paste JSON directly into the editor</li>
                <li>Import a JSON file</li>
                <li>Fix any syntax errors in your current JSON</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
