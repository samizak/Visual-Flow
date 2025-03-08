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
    <main className="min-h-screen p-4 flex gap-4">
      {/* Left Panel */}
      <LeftPanel jsonInput={jsonInput} setJsonInput={setJsonInput} />

      {/* Right Panel */}
      <div className="w-1/2">
        <Card className="p-4">
          <Tabs defaultValue="tree" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tree">Tree View</TabsTrigger>
              <TabsTrigger value="graph">Graph View</TabsTrigger>
              <TabsTrigger value="3d">3D Node View</TabsTrigger>
            </TabsList>
            <TabsContent value="tree" className="min-h-[500px]">
              {/* Tree View Component will go here */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Tree View Coming Soon
              </div>
            </TabsContent>
            <TabsContent value="graph" className="min-h-[500px]">
              {/* Graph View Component will go here */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Graph View Coming Soon
              </div>
            </TabsContent>
            <TabsContent value="3d" className="min-h-[500px]">
              {/* 3D View Component will go here */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                3D View Coming Soon
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}
