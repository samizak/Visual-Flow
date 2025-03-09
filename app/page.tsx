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
import RightPanel from "../components/Panel/RightPanel";
import Header from "../components/Layout/Header";

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
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel jsonInput={jsonData} setJsonInput={setJsonData} />

        <RightPanel
          jsonData={jsonData}
          setNodeCount={setNodeCount}
          nodeCount={nodeCount}
        />
      </div>

      <Footer isValidJson={isValidJson} nodeCount={nodeCount} />
    </main>
  );
}
