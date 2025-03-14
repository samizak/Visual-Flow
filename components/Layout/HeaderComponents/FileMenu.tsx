import React from "react";
import {
  FileIcon,
  Save,
  Upload,
  FileJson,
  Image as ImageIcon,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  File as FilePdf,
} from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../../ui/dropdown-menu";

// Update the FileMenu props interface to include export handlers
interface FileMenuProps {
  onSave?: () => void;
  onImport?: () => void;
  onImportJson?: () => void;
  onImportImage?: () => void;
  // Add these new props
  onExportPng?: () => void;
  onExportJpg?: () => void;
  onExportSvg?: () => void;
}

// In the return statement, let's update the Export submenu section
// to enable the image export options

export default function FileMenu({
  onSave,
  onImport,
  onImportJson,
  onImportImage,
  // Add these new props
  onExportPng,
  onExportJpg,
  onExportSvg,
}: FileMenuProps) {
  // Handle general import (fallback)
  const handleImportClick = () => {
    if (onImport) {
      onImport();
    }
  };

  // Handle JSON import
  const handleImportJsonClick = () => {
    if (onImportJson) {
      onImportJson();
    } else if (onImport) {
      // Fallback to general import if specific handler not provided
      onImport();
    }
  };

  // Handle Image import
  const handleImportImageClick = () => {
    if (onImportImage) {
      onImportImage();
    }
  };

  // Add these handlers to the FileMenu component
  const handleExportPngClick = () => {
    if (onExportPng) {
      onExportPng();
    }
  };

  const handleExportJpgClick = () => {
    if (onExportJpg) {
      onExportJpg();
    }
  };

  const handleExportSvgClick = () => {
    if (onExportSvg) {
      onExportSvg();
    }
  };

  // In the return statement, update the Export submenu
  return (
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
          <Save className="h-4 w-4" />
          <span>Save</span>
        </DropdownMenuItem>

        {/* Import submenu with JSON and Image options */}
        {onImportJson || onImportImage ? (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white">
              <Upload className="mr-2 h-4 w-4" />
              <span>Import</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-[#1e1e1e] border border-gray-700 shadow-lg">
              <DropdownMenuItem
                onClick={handleImportJsonClick}
                className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
              >
                <FileJson className="mr-2 h-4 w-4" />
                <span>Import JSON</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleImportImageClick}
                className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Import Image</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : (
          <DropdownMenuItem
            onClick={handleImportClick}
            className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            <span>Import</span>
          </DropdownMenuItem>
        )}

        {/* Export submenu with various export options */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white">
            <Download className="mr-2 h-4 w-4" />
            <span>Export</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-[#1e1e1e] border border-gray-700 shadow-lg">
            <DropdownMenuLabel className="text-xs text-gray-400">
              Images
            </DropdownMenuLabel>

            {/* Enable PNG export */}
            <DropdownMenuItem
              onClick={handleExportPngClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
            >
              <FileImage className="mr-2 h-4 w-4" />
              <span>Export as PNG</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleExportJpgClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
            >
              <FileImage className="mr-2 h-4 w-4" />
              <span>Export as JPG</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleExportSvgClick}
              className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
            >
              <FileImage className="mr-2 h-4 w-4" />
              <span>Export as SVG</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-gray-400">
              Data
            </DropdownMenuLabel>

            {/* Keep these disabled for now */}
            <DropdownMenuItem
              disabled
              className="cursor-not-allowed opacity-60 hover:bg-transparent text-gray-400"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <span>Export to Excel</span>
              <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">
                Coming Soon
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled
              className="cursor-not-allowed opacity-60 hover:bg-transparent text-gray-400"
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Export as CSV</span>
              <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">
                Coming Soon
              </span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
