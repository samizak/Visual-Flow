import React from "react";
import {
  FileIcon,
  Save,
  Upload,
  FileJson,
  Image as ImageIcon,
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

interface FileMenuProps {
  onSave?: () => void;
  onImport?: () => void;
  onImportJson?: () => void;
  onImportImage?: () => void;
}

export default function FileMenu({
  onSave,
  onImport,
  onImportJson,
  onImportImage,
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
