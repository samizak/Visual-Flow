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

interface EditMenuProps {
  onFormat?: () => void;
  onMinimize?: () => void;
  onCopy?: () => void;
}

export default function EditMenu({ onFormat, onMinimize, onCopy }: EditMenuProps) {
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
  );
}