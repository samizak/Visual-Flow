import JsonFlowChart from "../Visualizers/JsonFlowChart";
import {
  Box,
  Braces,
  Brackets,
  Type,
  FileJson,
  ArrowRight,
  Network,
} from "lucide-react"; // Added FileJson and ArrowRight icons
import { useMemo } from "react";
import { useState } from "react"; // Make sure useState is imported

// In RightPanel.tsx
export default function RightPanel({
  jsonData,
  parsedData,
  isValidJson,
  setNodeCount,
  nodeCount,
  edgeType,
  showGrid = true, // Add showGrid prop with default value
  onToggleGrid, // Add onToggleGrid prop
}: {
  jsonData: string;
  parsedData?: any;
  isValidJson: boolean;
  setNodeCount: (count: number) => void;
  nodeCount: number;
  edgeType: string;
  showGrid?: boolean; // Add to type definition
  onToggleGrid?: (show: boolean) => void; // Add to type definition
}) {
  // Add state for selected path
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  // Use the pre-parsed data if available, otherwise parse it here
  const data = useMemo(() => {
    if (parsedData) return parsedData;
    if (!jsonData || !isValidJson) return null;
    try {
      return JSON.parse(jsonData);
    } catch (e) {
      return null;
    }
  }, [jsonData, isValidJson, parsedData]);

  // Add export ready function
  const onExportReady = (exportFn: () => void) => {
    // This function will be called when the chart is ready to export
    // You can store the exportFn in state or call it directly if needed
  };

  return (
    <div className="flex-1 flex flex-col border-l border-gray-700">
      <div className="flex-grow relative">
        <div className="flex-1 bg-[#141414] overflow-hidden h-full">
          {jsonData ? (
            <>
              <JsonFlowChart
                jsonData={jsonData}
                edgeType={edgeType}
                showGrid={showGrid} // Pass showGrid prop
                onNodeCountChange={setNodeCount}
                isValidJson={isValidJson}
              />
            </>
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
      </div>
    </div>
  );
}
