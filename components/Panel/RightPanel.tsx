import { Dispatch, SetStateAction } from "react";
import JsonFlowChart from "../Visualizers/JsonFlowChart";
import { Box, Braces, Brackets, Type } from "lucide-react"; // Import icons

export default function RightPanel({
  jsonData,
  isValidJson = true,
  setNodeCount,
  nodeCount,
}: {
  jsonData: string;
  isValidJson?: boolean;
  setNodeCount: Dispatch<SetStateAction<number>>;
  nodeCount: number;
}) {
  return (
    <div className="flex-1 flex flex-col border-l border-gray-700">
      <div className="flex-grow relative">
        <div className="flex-1 bg-[#141414] overflow-hidden h-full">
          {jsonData ? (
            <>
              <JsonFlowChart
                jsonData={jsonData}
                isValidJson={isValidJson}
                onNodeCountChange={setNodeCount}
              />

              {/* Show an overlay warning when JSON is invalid */}
              {!isValidJson && (
                <div className="absolute top-4 right-4 bg-red-900/80 text-white px-3 py-2 rounded-md shadow-md text-sm">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>Invalid JSON - Showing last valid diagram</span>
                  </div>
                </div>
              )}

              {/* Legend overlay with icons */}
              <div className="absolute top-4 left-4 bg-[#1e1e1e] bg-opacity-80 p-2 rounded-md shadow-md">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#6b46c1] mr-1.5 rounded-sm"></div>
                    <span className="text-gray-300 text-xs flex items-center">
                      <Box size={14} className="mr-1" /> Root
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#3a506b] mr-1.5 rounded-sm"></div>
                    <span className="text-gray-300 text-xs flex items-center">
                      <Braces size={14} className="mr-1" /> Objects
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#b87333] mr-1.5 rounded-sm"></div>
                    <span className="text-gray-300 text-xs flex items-center">
                      <Brackets size={14} className="mr-1" /> Arrays
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#2e7d32] mr-1.5 rounded-sm"></div>
                    <span className="text-gray-300 text-xs flex items-center">
                      <Type size={14} className="mr-1" /> Primitives
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-lg">Enter JSON in the editor</p>
                <p className="text-sm mt-2 max-w-md text-gray-500">
                  Visualize your JSON data in a hierarchical tree structure
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
