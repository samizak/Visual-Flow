import React, { useState } from "react";
import SettingsDialog from "./SettingsDialog";
import PricingDialog from "./PricingDialog";

import PanelToggle from "./HeaderComponents/PanelToggle";
import FileMenu from "./HeaderComponents/FileMenu";
import EditMenu from "./HeaderComponents/EditMenu";
import ViewMenu from "./HeaderComponents/ViewMenu";
import SettingsButton from "./HeaderComponents/SettingsButton";

// Add these imports at the top of the file
import {
  exportAsPng,
  exportAsJpeg,
  exportAsSvg,
} from "../../utils/exportHandlers";

// Update the Header component props interface to include export handlers
interface HeaderProps {
  onFormat: () => void;
  onMinimize: () => void;
  onCopy: () => void;
  onTogglePanel: () => void;
  onSave: () => void;
  onImport: () => void;
  onImportJson: () => void;
  onImportImage: () => void;
  edgeStyle: string;
  onEdgeStyleChange: (style: string) => void;
  showGrid: boolean;
  onToggleGrid: (show: boolean) => void;
  // Add these new props
  onExportPng?: () => void;
  onExportJpg?: () => void;
  onExportSvg?: () => void;
  // Add missing prop
  onApplyChanges?: () => void;
}

export default function Header({
  onFormat,
  onMinimize,
  onCopy,
  onTogglePanel,
  onSave,
  onImport,
  onImportJson,
  onImportImage,
  edgeStyle,
  onEdgeStyleChange,
  showGrid,
  onToggleGrid,
  // Add these new props with default implementations
  onExportPng,
  onExportJpg,
  onExportSvg,
  // Add missing prop with default value
  onApplyChanges = () => {},
}: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  return (
    <header className="bg-[#1e1e1e] border-b border-gray-700 py-1 px-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PanelToggle
            onTogglePanel={onTogglePanel}
            // Fix: Remove collapseLeftPanel prop or pass it correctly
            // collapseLeftPanel={collapseLeftPanel}
          />

          <div className="h-5 w-px bg-gray-600 mx-0.5"></div>

          <div className="flex items-center space-x-1 pl-2">
            <FileMenu
              onSave={onSave}
              onImport={onImport}
              onImportJson={onImportJson}
              onImportImage={onImportImage}
              onExportPng={onExportPng}
              onExportJpg={onExportJpg}
              onExportSvg={onExportSvg}
            />
            <EditMenu
              onFormat={onFormat}
              onMinimize={onMinimize}
              onCopy={onCopy}
            />
            <ViewMenu onApplyChanges={onApplyChanges} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Upgrade to Pro button */}
          <button
            className="flex items-center px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer"
            onClick={() => setPricingOpen(true)}
          >
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            Upgrade to Pro
          </button>
          <SettingsButton onClick={() => setSettingsOpen(true)} />
          <SettingsDialog
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            edgeStyle={edgeStyle}
            onEdgeStyleChange={onEdgeStyleChange}
            showGrid={showGrid}
            onToggleGrid={onToggleGrid}
          />
        </div>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        edgeStyle={edgeStyle}
        onEdgeStyleChange={onEdgeStyleChange}
        showGrid={showGrid}
        onToggleGrid={onToggleGrid}
      />

      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
    </header>
  );
}
