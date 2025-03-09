"use client";

import { useState, useEffect, useRef } from "react";
import LeftPanel from "../components/Panel/LeftPanel";
import Footer from "../components/Layout/Footer";
import RightPanel from "../components/Panel/RightPanel";
import Header from "../components/Layout/Header";
import { toast } from "sonner";

export default function Home() {
  const [jsonData, setJsonData] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState(true);
  const [nodeCount, setNodeCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [collapseLeftPanel, setCollapseLeftPanel] = useState(false);

  const formatJson = () => {
    try {
      if (jsonData.trim()) {
        const parsedJson = JSON.parse(jsonData);
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        setJsonData(formattedJson);
        toast.success("JSON formatted successfully");
      }
    } catch (e) {
      toast.error("Cannot format invalid JSON");
    }
  };

  const minimizeJson = () => {
    try {
      if (jsonData.trim()) {
        const parsedJson = JSON.parse(jsonData);
        const minimizedJson = JSON.stringify(parsedJson);
        setJsonData(minimizedJson);
        toast.success("JSON minimized successfully");
      }
    } catch (e) {
      toast.error("Cannot minimize invalid JSON");
    }
  };

  const copyJson = () => {
    if (jsonData.trim()) {
      navigator.clipboard
        .writeText(jsonData)
        .then(() => toast.success("JSON copied to clipboard"))
        .catch((err) => {
          toast.error("Failed to copy JSON to clipboard");
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleSave = () => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

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

  const handleCollapseLeftPanel = () => {
    setCollapseLeftPanel((collapseLeftPanel) => !collapseLeftPanel);
  };

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
      <Header
        onFormat={formatJson}
        onMinimize={minimizeJson}
        onCopy={copyJson}
        onSave={handleSave}
        onCollapseLeftPanel={handleCollapseLeftPanel}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          jsonInput={jsonData}
          setJsonInput={setJsonData}
          collapseLeftPanel={collapseLeftPanel}
        />

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
