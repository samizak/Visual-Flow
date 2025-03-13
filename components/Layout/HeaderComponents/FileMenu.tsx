import React from "react";
import { FileIcon, Save, Upload } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface FileMenuProps {
  onSave?: () => void;
  onImport?: () => void;
}

export default function FileMenu({ onSave, onImport }: FileMenuProps) {
  const handleImportClick = () => {
    if (onImport) {
      onImport();
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
  );
}