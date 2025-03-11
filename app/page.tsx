"use client";

import { useState, useEffect, useRef } from "react";
import LeftPanel from "../components/Panel/LeftPanel";
import Footer from "../components/Layout/Footer";
import RightPanel from "../components/Panel/RightPanel";
import Header from "../components/Layout/Header";
import DragOverlay from "../components/DragOverlay";
import { useJsonOperations } from "../hooks/useJsonOperations";
import { useFileOperations } from "../hooks/useFileOperations";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { useMouseInteractions } from "../hooks/useMouseInteractions";

export default function Home() {
  const [nodeCount, setNodeCount] = useState(0);
  const [collapseLeftPanel, setCollapseLeftPanel] = useState(false);
  const [edgeType, setEdgeType] = useState<string>("default");

  // Add a separate state for visualization JSON
  const [visualizationJson, setVisualizationJson] = useState<string>("");

  // Custom hooks
  const {
    jsonData,
    setJsonData,
    isValidJson,
    formatJson,
    minimizeJson,
    copyJson,
    saveJson,
  } = useJsonOperations();

  // Update visualization JSON only when JSON is valid and user explicitly applies changes
  const applyChangesToVisualization = () => {
    if (isValidJson && jsonData.trim()) {
      setVisualizationJson(jsonData);
    }
  };

  // Track the last parsed JSON to avoid unnecessary updates
  const lastParsedJsonRef = useRef<any>(null);

  // Update visualization JSON when JSON content changes semantically
  useEffect(() => {
    if (isValidJson && jsonData.trim()) {
      try {
        const parsedJson = JSON.parse(jsonData);

        // Compare the current parsed JSON with the last one
        const currentJsonStr = JSON.stringify(parsedJson);
        const lastJsonStr = lastParsedJsonRef.current
          ? JSON.stringify(lastParsedJsonRef.current)
          : "";

        // Only update if the content has actually changed
        if (currentJsonStr !== lastJsonStr) {
          lastParsedJsonRef.current = parsedJson;
          setVisualizationJson(jsonData);
        }
      } catch (e) {
        // If parsing fails, don't update
      }
    }
  }, [isValidJson, jsonData]);

  const { handleFiles, importFile } = useFileOperations({
    setJsonData,
    onSuccessfulLoad: (content) => {
      setVisualizationJson(content);
    },
  });

  const {
    isFileDragging,
    dragError,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop({ onFilesDrop: handleFiles });

  const { mainRef, handleMouseDown } = useMouseInteractions();

  return (
    <main
      ref={mainRef}
      className={`min-h-screen flex flex-col h-screen overflow-hidden ${
        isFileDragging
          ? dragError
            ? "bg-red-900/20 ring-2 ring-red-500 ring-inset"
            : "bg-gray-900 ring-2 ring-indigo-500 ring-inset"
          : ""
      }`}
      onMouseDown={handleMouseDown}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DragOverlay isVisible={isFileDragging} error={dragError} />

      <Header
        onFormat={formatJson}
        onMinimize={minimizeJson}
        onCopy={copyJson}
        onTogglePanel={() => setCollapseLeftPanel(!collapseLeftPanel)}
        onSave={saveJson}
        onImport={importFile}
        edgeStyle={edgeType}
        onEdgeStyleChange={(style) => setEdgeType(style)}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          jsonInput={jsonData}
          setJsonInput={setJsonData}
          collapseLeftPanel={collapseLeftPanel}
          isValidJson={isValidJson}
          onApplyChanges={applyChangesToVisualization}
        />

        <RightPanel
          jsonData={visualizationJson}
          isValidJson={isValidJson && !!visualizationJson}
          setNodeCount={setNodeCount}
          nodeCount={nodeCount}
          edgeType={edgeType}
          // Remove the JSON.parse from here to avoid errors during rendering
          parsedData={
            isValidJson && visualizationJson ? visualizationJson : null
          }
        />
      </div>

      <Footer isValidJson={isValidJson} nodeCount={nodeCount} />
    </main>
  );
}
