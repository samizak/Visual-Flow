"use client";

import { useState, useEffect, useRef } from "react";
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
// Remove duplicate useEffect import
import { storageService } from "../../utils/storageService";
// Add SettingsDialog import
import SettingsDialog from "../../components/Layout/SettingsDialog";

export default function Home() {
  const [nodeCount, setNodeCount] = useState(0);
  const [collapseLeftPanel, setCollapseLeftPanel] = useState(false);
  const [edgeType, setEdgeType] = useState<string>("default");
  const [showGrid, setShowGrid] = useState(true);
  // Add missing state for settings dialog
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const [visualizationJson, setVisualizationJson] = useState<string>("");

  const {
    jsonData,
    setJsonData,
    isValidJson,
    formatJson,
    minimizeJson,
    copyJson,
    saveJson,
  } = useJsonOperations();

  // Load saved JSON data when component mounts
  // In the useEffect for loading settings
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
  }, [setJsonData]);

  // Save settings when they change
  useEffect(() => {
    storageService.saveSettings({
      edgeStyle: edgeType, // Fix variable name
      showGrid,
    });
  }, [edgeType, showGrid]); // Fix variable name in dependency array

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

  // Update your edge style handler
  const handleEdgeStyleChange = (style: string) => {
    setEdgeType(style);
    storageService.saveSettings({ edgeStyle: style });
  };

  // Update your grid toggle handler
  const handleToggleGrid = (show: boolean) => {
    setShowGrid(show);
    storageService.saveSettings({ showGrid: show });
  };

  // Move the SettingsDialog component into the return statement
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
        onImportJson={() => handleJsonImport(setJsonData, setIsLoading)}
        onImportImage={() =>
          handleImageImport(setJsonData, setIsOcrProcessing, setOcrProgress)
        }
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
        onExportPng={() => exportAsPng()}
        onExportJpg={() => exportAsJpeg()}
        onExportSvg={() => exportAsSvg()}
        onApplyChanges={applyChangesToVisualization}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Add SettingsDialog component here */}
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        edgeStyle={edgeType}
        onEdgeStyleChange={handleEdgeStyleChange}
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
      />

      {/* Add the OCR processing status component */}
      <OcrProcessingStatus
        isProcessing={isOcrProcessing}
        progress={ocrProgress}
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
          showGrid={showGrid}
          onToggleGrid={handleToggleGrid}
        />
      </div>
      <Footer isValidJson={isValidJson} nodeCount={nodeCount} />
    </main>
  );
}
