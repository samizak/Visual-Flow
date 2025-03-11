import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import {
  PanelLeft,
  FileIcon,
  Eye,
  Copy,
  FileCode,
  Minimize,
  Save,
  Upload,
  LayoutGrid,
  Layers,
  Settings,
  Play,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SettingsDialog from "./SettingsDialog";

// Add to the interface
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
}: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input click
  const handleImportClick = () => {
    if (onImport) {
      onImport();
    }
  };

  return (
    <header className="bg-[#1e1e1e] border-b border-gray-700 py-1 px-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePanel}
            className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
            title="Collapse Editor"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          <div className="h-5 w-px bg-gray-600 mx-0.5"></div>

          <div className="flex items-center space-x-1">
            {/* File dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors select-none"
                >
                  <FileIcon className="mr-1 h-4 w-4" />
                  File
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
                <DropdownMenuLabel>File Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onSave}
                  className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  <span>Save</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleImportClick}
                  className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Import</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors select-none"
                >
                  <FileCode className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
                <DropdownMenuLabel>Edit Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onFormat}
                  className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
                >
                  <FileCode className="mr-2 h-4 w-4" />
                  <span>Format JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onMinimize}
                  className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
                >
                  <Minimize className="mr-2 h-4 w-4" />
                  <span>Minimize JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onCopy}
                  className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy JSON</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors select-none"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onApplyChanges && (
                  <DropdownMenuItem
                    onClick={onApplyChanges}
                    className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    <span>Apply Changes</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  <span>Diagram View</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white">
                  <Layers className="mr-2 h-4 w-4" />
                  <span>3D Node View</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white">
                  <span>Tree View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSettingsOpen(true)}
                  className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Add Apply Changes button to the right side of the header */}
        {onApplyChanges && (
          <Button
            variant="outline"
            size="sm"
            onClick={onApplyChanges}
            className="bg-indigo-600 hover:bg-indigo-700 text-white border-none hover:text-white transition-colors"
          >
            <Play className="mr-1 h-4 w-4" />
            Apply Changes
          </Button>
        )}
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
