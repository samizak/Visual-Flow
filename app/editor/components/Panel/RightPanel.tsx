import React from "react";
import JsonFlowChart from "../Visualizers/JsonFlowChart";
import { useJsonStore } from "@/store/useJsonStore";
import { FileJson, ArrowRight, Network } from "lucide-react";

export default function RightPanel() {
  const { visualizationJson, isValidJson, setNodeCount, edgeType, showGrid } =
    useJsonStore();

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
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <FileJson className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-lg">Enter JSON in the editor</p>
            <p className="text-sm mt-2 max-w-md text-gray-500">
              Visualize your JSON data as interactive node diagrams
            </p>
            <div className="mt-4 flex items-center justify-center text-gray-500">
              <div className="flex items-center px-3 py-1.5 bg-gray-800/50 rounded-md border border-gray-700">
                <FileJson className="h-4 w-4 text-indigo-400" />
                <span className="mx-2">JSON</span>
                <ArrowRight className="mx-2 w-4 h-4 text-indigo-400" />
                <Network className="h-4 w-4 text-indigo-400" />
                <span className="mx-2">Flow Chart</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
