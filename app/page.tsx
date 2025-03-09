"use client";

import { useState, useEffect, useRef } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import LeftPanel from "../components/Panel/LeftPanel";
import JsonFlowChart from "../components/Visualizers/JsonFlowChart";
import Footer from "../components/Layout/Footer";

export default function Home() {
  const [jsonData, setJsonData] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState(true);
  const [nodeCount, setNodeCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Validate JSON whenever input changes
  useEffect(() => {
    if (jsonData.trim() === "") {
      setIsValidJson(true);
      return;
    }
    try {
      if (jsonData.trim()) {
        JSON.parse(jsonData);
        setIsValidJson(true);
      } else {
        setIsValidJson(false);
      }
    } catch (e) {
      setIsValidJson(false);
    }
  }, [jsonData]);

  // Handle mouse events to prevent text selection during dragging
  const handleMouseDown = () => {
    setIsDragging(true);
    if (mainRef.current) {
      mainRef.current.classList.add("no-select");
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (mainRef.current) {
      mainRef.current.classList.remove("no-select");
    }
  };

  // Add event listeners for mouse events
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className="min-h-screen flex flex-col h-screen overflow-hidden"
      onMouseDown={handleMouseDown}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <LeftPanel jsonInput={jsonData} setJsonInput={setJsonData} />

        {/* Right Panel */}
        <div className="flex-1 flex flex-col border-l border-gray-700">
          <div className="flex-grow relative">
            <Tabs defaultValue="tree" className="w-full h-full flex flex-col">
              <div className="bg-[#1e1e1e] border-b border-gray-700 py-2">
                <TabsList className="relative flex w-full bg-transparent p-0 mx-auto max-w-3xl">
                  <TabsTrigger
                    value="tree"
                    className="flex-1 py-5 px-4 text-sm font-medium text-gray-400 transition-all duration-200 data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-[#0e639c] rounded-none relative"
                  >
                    Diagram View
                  </TabsTrigger>
                  <TabsTrigger
                    value="3d"
                    className="flex-1 py-5 px-4 text-sm font-medium text-gray-400 transition-all duration-200 data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-[#0e639c] rounded-none relative"
                  >
                    3D Node View
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 bg-[#141414] overflow-hidden">
                <TabsContent value="tree" className="h-full relative">
                  {jsonData ? (
                    <>
                      <JsonFlowChart
                        jsonData={jsonData}
                        onNodeCountChange={setNodeCount}
                      />
                      {/* Legend overlay */}
                      <div className="absolute top-4 left-4 bg-[#1e1e1e] bg-opacity-80 p-2 rounded-md shadow-md">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#3a506b] mr-1.5 rounded-sm"></div>
                            <span className="text-gray-300 text-xs">
                              Objects
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-[#b87333] mr-1.5 rounded-sm"></div>
                            <span className="text-gray-300 text-xs">
                              Arrays
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
                        <p className="text-sm mt-2 max-w-md">
                          Visualize your JSON data in a hierarchical tree
                          structure
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Adding 3D View Tab Content with template message */}
                <TabsContent value="3d" className="h-full relative">
                  {jsonData ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="text-gray-400">
                        <p>3D visualization coming soon</p>
                      </div>
                    </div>
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
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        <p className="text-lg">Enter JSON in the editor</p>
                        <p className="text-sm mt-2 max-w-md">
                          Visualize your JSON data in an interactive 3D space
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Legend */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#3a506b] mr-1.5 rounded-sm"></div>
                    <span className="text-gray-300">Objects</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#b87333] mr-1.5 rounded-sm"></div>
                    <span className="text-gray-300">Arrays</span>
                  </div>
                  <div className="text-gray-300">Total Nodes: {nodeCount}</div>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer isValidJson={isValidJson} nodeCount={nodeCount} />
    </main>
  );
}
