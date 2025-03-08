"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
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
    <main className="min-h-screen p-4 flex">
      {/* Left Panel */}
      <LeftPanel jsonInput={jsonInput} setJsonInput={setJsonInput} />

      {/* Right Panel - Improved design */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        <Card className="flex-1 p-6 bg-[#1e1e1e] border-gray-700 shadow-lg rounded-lg overflow-hidden flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">
            Visualization
          </h2>
          <Tabs defaultValue="tree" className="w-full flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-[#252525] p-1 rounded-md mb-4">
              <TabsTrigger
                value="tree"
                className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white"
              >
                Tree View
              </TabsTrigger>
              <TabsTrigger
                value="graph"
                className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white"
              >
                Graph View
              </TabsTrigger>
              <TabsTrigger
                value="3d"
                className="data-[state=active]:bg-[#0e639c] data-[state=active]:text-white"
              >
                3D Node View
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 bg-[#252525] rounded-lg overflow-hidden">
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
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                    <p className="text-lg">Graph View Coming Soon</p>
                    <p className="text-sm mt-2 max-w-md">
                      Explore relationships in your data with an interactive
                      graph
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
                        d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12a4 4 0 108 0 4 4 0 00-8 0z"
                      />
                    </svg>
                    <p className="text-lg">3D View Coming Soon</p>
                    <p className="text-sm mt-2 max-w-md">
                      Experience your data in an immersive 3D visualization
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}
