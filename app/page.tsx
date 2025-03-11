"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [isFileDragging, setIsFileDragging] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [collapseLeftPanel, setCollapseLeftPanel] = useState(false);
  const [edgeType, setEdgeType] = useState<string>("default");
  const dragCounterRef = useRef(0); // Add a counter to track drag events

  // Handle file drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // No need to set state here, just prevent default
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Increment counter when drag enters any element
    dragCounterRef.current++;
    
    // Only show the overlay when we're actually dragging files
    if (e.dataTransfer.types.includes('Files')) {
      setIsFileDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Decrement counter when drag leaves any element
    dragCounterRef.current--;
    
    // Only hide the overlay when we've left all elements
    if (dragCounterRef.current === 0) {
      setIsFileDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset counter and state
    dragCounterRef.current = 0;
    setIsFileDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }, []);

  // Process the dropped files
  const handleFiles = useCallback((files: FileList) => {
    const file = files[0];
    
    // Check if file is a JSON file
    if (!file.name.toLowerCase().endsWith('.json')) {
      toast.error("Only JSON files are currently supported");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Try to parse the JSON to validate it
        JSON.parse(content);
        setJsonData(content);
        toast.success(`File "${file.name}" loaded successfully`);
      } catch (error) {
        toast.error("Invalid JSON file. Please check the file format.");
      }
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsText(file);
  }, []);

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

  const handleImport = () => {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json";

    // Handle file selection
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          // Try to parse to validate it's proper JSON
          JSON.parse(content);
          // Set the JSON data
          setJsonData(content);
          toast.success("JSON imported successfully");
        } catch (error) {
          toast.error("Invalid JSON file");
          console.error("Error parsing JSON file:", error);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
      };

      reader.readAsText(file);
    };

    // Trigger the file input click
    fileInput.click();
  };

  useEffect(() => {
    if (jsonData.trim() === "") {
      setIsValidJson(true);
      return;
    }
    try {
      if (jsonData.trim()) {
        // Actually parse the JSON to validate it
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

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className={`min-h-screen flex flex-col h-screen overflow-hidden ${
        isFileDragging ? "bg-gray-900 ring-2 ring-indigo-500 ring-inset" : ""
      }`}
      onMouseDown={handleMouseDown}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isFileDragging && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#1e1e1e] p-6 rounded-lg border-2 border-indigo-500 shadow-lg">
            <p className="text-white text-xl text-center">Drop JSON file here</p>
          </div>
        </div>
      )}

      <Header
        onFormat={formatJson}
        onMinimize={minimizeJson}
        onCopy={copyJson}
        onTogglePanel={() => setCollapseLeftPanel(!collapseLeftPanel)}
        onSave={handleSave}
        onImport={handleImport}
        edgeStyle={edgeType}
        onEdgeStyleChange={setEdgeType}
        onFileLoad={setJsonData}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          jsonInput={jsonData}
          setJsonInput={setJsonData}
          collapseLeftPanel={collapseLeftPanel}
        />

        <RightPanel
          jsonData={jsonData}
          isValidJson={isValidJson}
          setNodeCount={setNodeCount}
          nodeCount={nodeCount}
          edgeType={edgeType}
        />
      </div>

      <Footer isValidJson={isValidJson} nodeCount={nodeCount} />
    </main>
  );
}
