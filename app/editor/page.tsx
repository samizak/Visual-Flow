"use client";

import { useEffect, useRef } from "react";
import LeftPanel from "../../components/Panel/LeftPanel";
import Footer from "../../components/Layout/Footer";
import RightPanel from "../../components/Panel/RightPanel";
import Header from "../../components/Layout/Header";
import DragOverlay from "../../components/DragOverlay";
import { useJsonOperations } from "../../hooks/useJsonOperations";
import { useFileOperations } from "../../hooks/useFileOperations";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useMouseInteractions } from "../../hooks/useMouseInteractions";
import {
  handleJsonImport,
  handleImageImport,
} from "../../utils/importHandlers";
import OcrProcessingStatus from "../../components/OCR/OcrProcessingStatus";
import {
  exportAsPng,
  exportAsJpeg,
  exportAsSvg,
} from "../../utils/exportHandlers";
import { storageService } from "../../utils/storageService";
import SettingsDialog from "../../components/Layout/SettingsDialog";
import { useJsonStore } from "../../store/useJsonStore";

export default function Home() {
  // Use the Zustand store
  const {
    jsonData,
    setJsonData,
    visualizationJson,
    setVisualizationJson,
    isValidJson,
    nodeCount,
    setNodeCount,
    collapseLeftPanel,
    toggleLeftPanel,
    edgeType,
    setEdgeType,
    showGrid,
    setShowGrid,
    isSettingsOpen,
    setIsSettingsOpen,
    isOcrProcessing,
    setOcrProcessing,
    ocrProgress,
    setOcrProgress,
    isLoading,
    setIsLoading,
    applyChangesToVisualization,
  } = useJsonStore();

  const { formatJson, minimizeJson, copyJson, saveJson } = useJsonOperations();

  // Track the last parsed JSON to avoid unnecessary updates
  const lastParsedJsonRef = useRef<any>(null);

  // Load saved settings when component mounts
  useEffect(() => {
    // Load all settings at once
    const savedSettings = storageService.getSettings();

    // Apply settings
    if (savedSettings.edgeStyle) {
      setEdgeType(savedSettings.edgeStyle);
    }

    if (savedSettings.showGrid !== undefined) {
      setShowGrid(savedSettings.showGrid);
    }

    // Load JSON content if auto-save is enabled
    if (savedSettings.autoSaveEnabled) {
      const jsonContent = storageService.getJsonData();
      if (jsonContent && jsonContent.content) {
        setJsonData(jsonContent.content);
        // Also set visualization JSON if needed
        setVisualizationJson(jsonContent.content);
      }
    }
  }, [setJsonData, setEdgeType, setShowGrid, setVisualizationJson]);

  // Auto-save JSON data when it changes
  useEffect(() => {
    const settings = storageService.getSettings();
    if (settings.autoSaveEnabled && isValidJson && jsonData) {
      // Add debounce to avoid excessive saves
      const debounceTimer = setTimeout(() => {
        storageService.saveJsonData(jsonData);
      }, 1000); // 1 second debounce

      return () => clearTimeout(debounceTimer);
    }
  }, [jsonData, isValidJson]);

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
  }, [isValidJson, jsonData, setVisualizationJson]);

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

  // Handle edge style change
  const handleEdgeStyleChange = (style: string) => {
    setEdgeType(style);
  };

  // Handle grid toggle
  const handleToggleGrid = (show: boolean) => {
    setShowGrid(show);
  };

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
        onTogglePanel={toggleLeftPanel}
        onSave={saveJson}
        onImport={importFile}
        edgeStyle={edgeType}
        onEdgeStyleChange={handleEdgeStyleChange}
        onImportJson={() => handleJsonImport(setJsonData, setIsLoading)}
        onImportImage={() =>
          handleImageImport(setJsonData, setOcrProcessing, setOcrProgress)
        }
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
        onExportPng={() => exportAsPng()}
        onExportJpg={() => exportAsJpeg()}
        onExportSvg={() => exportAsSvg()}
        onApplyChanges={applyChangesToVisualization}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        edgeStyle={edgeType}
        onEdgeStyleChange={handleEdgeStyleChange}
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
      />

      <OcrProcessingStatus
        isProcessing={isOcrProcessing}
        progress={ocrProgress}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <RightPanel />
      </div>
      <Footer isValidJson={isValidJson} nodeCount={nodeCount} />
    </main>
  );
}
