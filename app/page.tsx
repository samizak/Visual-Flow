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

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");

  return (
    <main className="min-h-screen flex">
      {/* Left Panel */}
      <LeftPanel jsonInput={jsonInput} setJsonInput={setJsonInput} />

      {/* Right Panel - Improved design to match left panel */}
      <div className="flex-1 h-screen flex flex-col border-l border-gray-700">
        <div className="bg-[#1e1e1e] p-3 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Visualization</h1>
        </div>
        <div className="flex-grow relative">
          <Tabs defaultValue="tree" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-[#252525] mb-4">
              <TabsTrigger
                value="tree"
                className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white rounded-none"
              >
                Tree View
              </TabsTrigger>
              <TabsTrigger
                value="graph"
                className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white rounded-none"
              >
                Graph View
              </TabsTrigger>
              <TabsTrigger
                value="3d"
                className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white rounded-none"
              >
                3D Node View
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
              <TabsContent value="tree" className="h-full p-4">
                {/* Tree View Component will go here */}
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
                    <p className="text-lg">Tree View Coming Soon</p>
                    <p className="text-sm mt-2 max-w-md">
                      Visualize your JSON data in a hierarchical tree structure
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="graph" className="h-full p-4">
                {/* Graph View Component will go here */}
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
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p className="text-lg">Graph View Coming Soon</p>
                    <p className="text-sm mt-2 max-w-md">
                      Explore relationships in your JSON data with an interactive network graph
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="3d" className="h-full p-4">
                {/* 3D View Component will go here */}
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <p className="text-lg">3D Node View Coming Soon</p>
                    <p className="text-sm mt-2 max-w-md">
                      Experience your JSON data in an immersive 3D visualization
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
