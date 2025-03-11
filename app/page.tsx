"use client";

import { useState } from "react";
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

  // Custom hooks
  const {
    jsonData,
    setJsonData,
    isValidJson,  // Make sure this is being destructured from useJsonOperations
    formatJson,
    minimizeJson,
    copyJson,
    saveJson,
  } = useJsonOperations();

  const { handleFiles, importFile } = useFileOperations({ setJsonData });

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
        onEdgeStyleChange={setEdgeType}
        onFileLoad={setJsonData}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          jsonInput={jsonData}
          setJsonInput={setJsonData}
          collapseLeftPanel={collapseLeftPanel}
          isValidJson={isValidJson}  // Make sure this prop is being passed
        />

        <RightPanel
          jsonData={jsonData}
          isValidJson={isValidJson}  // Make sure this prop is being passed
          setNodeCount={setNodeCount}
          nodeCount={nodeCount}
          edgeType={edgeType}
        />
      </div>

      <Footer isValidJson={isValidJson} nodeCount={nodeCount} />
    </main>
  );
}
