import React, { useState, useRef } from "react";
import SettingsDialog from "./SettingsDialog";

// Import the new components
import PanelToggle from "./HeaderComponents/PanelToggle";
import FileMenu from "./HeaderComponents/FileMenu";
import EditMenu from "./HeaderComponents/EditMenu";
import ViewMenu from "./HeaderComponents/ViewMenu";
import SettingsButton from "./HeaderComponents/SettingsButton";
import ApplyChangesButton from "./HeaderComponents/ApplyChangesButton";

interface HeaderProps {
  onFormat?: () => void;
  onMinimize?: () => void;
  onCopy?: () => void;
  onTogglePanel?: () => void;
  onSave?: () => void;
  onImport?: () => void;
  edgeStyle?: string;
  onEdgeStyleChange: (style: string) => void;
  onFileLoad?: (content: string) => void;
  onApplyChanges?: () => void;
  collapseLeftPanel?: boolean;
}

export default function Header({
  onFormat,
  onMinimize,
  onCopy,
  onTogglePanel,
  onSave,
  onImport,
  edgeStyle,
  onEdgeStyleChange,
  onFileLoad,
  onApplyChanges,
  collapseLeftPanel = false,
}: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="bg-[#1e1e1e] border-b border-gray-700 py-1 px-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PanelToggle 
            onTogglePanel={onTogglePanel} 
            collapseLeftPanel={collapseLeftPanel} 
          />

          <div className="h-5 w-px bg-gray-600 mx-0.5"></div>

          <div className="flex items-center space-x-1 pl-2">
            <FileMenu onSave={onSave} onImport={onImport} />
            <EditMenu onFormat={onFormat} onMinimize={onMinimize} onCopy={onCopy} />
            <ViewMenu onApplyChanges={onApplyChanges} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <SettingsButton onClick={() => setSettingsOpen(true)} />
          <ApplyChangesButton onClick={onApplyChanges} />
        </div>
      </div>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        edgeStyle={edgeStyle}
        onEdgeStyleChange={onEdgeStyleChange}
      />
    </header>
  );
}
