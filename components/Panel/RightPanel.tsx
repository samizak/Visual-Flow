import JsonFlowChart from "../Visualizers/JsonFlowChart";
import { FileJson, ArrowRight, Network } from "lucide-react";
import { useCallback } from "react";
// Import ReactFlowInstance type
import { ReactFlowInstance } from "reactflow";

export default function RightPanel({
  jsonData,
  isValidJson,
  setNodeCount,
  edgeType,
  showGrid = true,
  onToggleGrid,
}: {
  jsonData: string;
  parsedData?: any;
  isValidJson: boolean;
  setNodeCount: (count: number) => void;
  nodeCount: number;
  edgeType: string;
  showGrid?: boolean;
  onToggleGrid?: (show: boolean) => void;
}) {
  // Add the onInit callback inside the component
  const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
    // Store the instance globally for access in export functions
    (window as any).reactFlowInstance = reactFlowInstance;
  }, []);

  return (
    <div className="flex-1 flex flex-col border-l border-gray-700">
      <div className="flex-grow relative">
        <div className="flex-1 bg-[#141414] overflow-hidden h-full">
          {jsonData ? (
            <>
              <JsonFlowChart
                jsonData={jsonData}
                edgeType={edgeType}
                showGrid={showGrid}
                onNodeCountChange={setNodeCount}
                isValidJson={isValidJson}
                onInit={onInit} // Pass the onInit callback to JsonFlowChart
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
