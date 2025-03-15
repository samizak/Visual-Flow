import React from "react";
import { FileCode, Minimize, Copy } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useJsonStore } from "../../../store/useJsonStore";
import { useJsonOperations } from "../../../hooks/useJsonOperations";

export default function EditMenu() {
  // Get the JSON data from the Zustand store
  const { jsonData, setJsonData } = useJsonStore();
  
  // Create a custom version of the operations that uses the store data
  const handleFormatJson = () => {
    try {
      if (jsonData.trim()) {
        const parsedJson = JSON.parse(jsonData);
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        
        // Update the store with the formatted JSON
        setJsonData(formattedJson);
        
        // Show success toast
        successToast("JSON formatted successfully");
      } else {
        errorToast("No JSON to format");
      }
    } catch (e) {
      errorToast("Cannot format invalid JSON");
    }
  };
  
  const handleMinimizeJson = () => {
    try {
      if (jsonData.trim()) {
        const parsedJson = JSON.parse(jsonData);
        const minimizedJson = JSON.stringify(parsedJson);
        
        // Update the store with the minimized JSON
        setJsonData(minimizedJson);
        
        // Show success toast
        successToast("JSON minimized successfully");
      } else {
        errorToast("No JSON to minimize");
      }
    } catch (e) {
      errorToast("Cannot minimize invalid JSON");
    }
  };
  
  const handleCopyJson = () => {
    try {
      if (jsonData.trim()) {
        navigator.clipboard.writeText(jsonData);
        successToast("JSON copied to clipboard");
      } else {
        errorToast("No JSON to copy");
      }
    } catch (e) {
      errorToast("Failed to copy JSON to clipboard");
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
          <FileCode className="mr-1 h-4 w-4" />
          Edit
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
        <DropdownMenuLabel>Edit Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleFormatJson}
          className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
        >
          <FileCode className="mr-2 h-4 w-4" />
          <span>Format JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleMinimizeJson}
          className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
        >
          <Minimize className="mr-2 h-4 w-4" />
          <span>Minimize JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyJson}
          className="cursor-pointer hover:bg-gray-800 hover:text-white transition-colors focus:bg-gray-700 focus:text-white"
        >
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Import toast functions
import { successToast, errorToast } from "../../../lib/toast";