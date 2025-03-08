"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import LeftPanel from "../components/Panel/LeftPanel";
import JsonFlowChart from "../components/Visualizers/JsonFlowChart";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");

  return (
    <main className="min-h-screen flex">
      {/* Left Panel */}
      <LeftPanel jsonInput={jsonInput} setJsonInput={setJsonInput} />

      {/* Right Panel */}
      <div className="flex-1 h-screen flex flex-col border-l border-gray-700">
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
                Flow View
              </TabsTrigger>
              {/* <TabsTrigger
                value="graph"
                className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white rounded-none"
              >
                Graph View
              </TabsTrigger> */}
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
                  <JsonFlowChart jsonData={jsonInput} />
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
    </main>
  );
}
