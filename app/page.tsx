"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import LeftPanel from "../components/Panel/LeftPanel";
import JsonFlowChart from "../components/Visualizers/jsonflowchart";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);
  const [nodeCount, setNodeCount] = useState(0);

  // Validate JSON whenever input changes
  useEffect(() => {
    if (jsonInput.trim() === "") {
      setIsValidJson(true);
      return;
    }
    try {
      if (jsonInput.trim()) {
        JSON.parse(jsonInput);
        setIsValidJson(true);
      } else {
        setIsValidJson(false);
      }
    } catch (e) {
      setIsValidJson(false);
    }
  }, [jsonInput]);

  return (
    <main className="min-h-screen flex flex-col h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <LeftPanel jsonInput={jsonInput} setJsonInput={setJsonInput} />

        {/* Right Panel */}
        <div className="flex-1 flex flex-col border-l border-gray-700">
          <div className="bg-[#1e1e1e] p-3 border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-white">Visualization</h1>
          </div>
          <div className="flex-grow relative">
            <Tabs defaultValue="tree" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-[#252525] mb-4">
                <TabsTrigger
                  value="tree"
                  className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white rounded-none"
                >
                  Diagram View
                </TabsTrigger>
                <TabsTrigger
                  value="3d"
                  className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white rounded-none"
                >
                  3D Node View
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 bg-[#141414] overflow-hidden">
                <TabsContent value="tree" className="h-full">
                  {jsonInput ? (
                    <JsonFlowChart
                      jsonData={jsonInput}
                      onNodeCountChange={setNodeCount}
                    />
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
                        <p className="text-sm mt-2 max-w-md">
                          Visualize your JSON data in a hierarchical tree
                          structure
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Keep the other tab contents as they were */}
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="h-8 bg-[#1e1e1e] border-t border-gray-700 flex items-center justify-between px-4 text-sm">
        <div className="flex items-center">
          <span className="mr-2">JSON Status:</span>
          {isValidJson ? (
            <>
              <svg
                className="w-4 h-4 text-green-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-500">Valid</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 text-red-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-red-500">Invalid</span>
            </>
          )}
        </div>
        <div className="text-gray-300">Total Nodes: {nodeCount}</div>
      </div>
    </main>
  );
}
