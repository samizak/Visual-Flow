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
import OcrProcessingStatus from "../../components/OCR/OcrProcessingStatus";
import { storageService } from "../../utils/storageService";
import SettingsDialog from "../../components/Layout/SettingsDialog";
import { useJsonStore } from "../../store/useJsonStore";

export default function Home() {
  const {
    jsonData,
    setJsonData,
    setVisualizationJson,
    isValidJson,
    nodeCount,
    edgeType,
    setEdgeType,
    showGrid,
    setShowGrid,
    isSettingsOpen,
    setIsSettingsOpen,
    isOcrProcessing,
    ocrProgress,
  } = useJsonStore();

  const lastParsedJsonRef = useRef<any>(null);

  useEffect(() => {
    const savedSettings = storageService.getSettings();

    if (savedSettings.edgeStyle) {
      setEdgeType(savedSettings.edgeStyle);
    }

    if (savedSettings.showGrid !== undefined) {
      setShowGrid(savedSettings.showGrid);
    }

    if (savedSettings.autoSaveEnabled) {
      const jsonContent = storageService.getJsonData();
      if (jsonContent && jsonContent.content) {
        setJsonData(jsonContent.content);
        setVisualizationJson(jsonContent.content);
      }
    }
  }, [setJsonData, setEdgeType, setShowGrid, setVisualizationJson]);

  useEffect(() => {
    const settings = storageService.getSettings();
    if (settings.autoSaveEnabled && isValidJson && jsonData) {
      const debounceTimer = setTimeout(() => {
        storageService.saveJsonData(jsonData);
      }, 1000); // 1 second debounce

      return () => clearTimeout(debounceTimer);
    }
  }, [jsonData, isValidJson]);

  useEffect(() => {
    if (isValidJson && jsonData.trim()) {
      try {
        const parsedJson = JSON.parse(jsonData);

        const currentJsonStr = JSON.stringify(parsedJson);
        const lastJsonStr = lastParsedJsonRef.current
          ? JSON.stringify(lastParsedJsonRef.current)
          : "";

        if (currentJsonStr !== lastJsonStr) {
          lastParsedJsonRef.current = parsedJson;
          setVisualizationJson(jsonData);
        }
      } catch (e) {}
    }
  }, [isValidJson, jsonData, setVisualizationJson]);

  const { handleFiles } = useFileOperations({
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

  const handleEdgeStyleChange = (style: string) => {
    setEdgeType(style);
  };

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
      <Header />

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
