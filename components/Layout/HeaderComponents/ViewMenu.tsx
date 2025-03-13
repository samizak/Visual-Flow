import React from "react";
import { Eye, Play, LayoutGrid, Layers } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface ViewMenuProps {
  onApplyChanges?: () => void;
}

export default function ViewMenu({ onApplyChanges }: ViewMenuProps) {
  return (
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
        <DropdownMenuItem
          className="opacity-50 cursor-not-allowed inline-flex whitespace-nowrap text-xs"
          title="3D View coming soon"
          disabled
        >
          <Layers className="mr-2 h-4 w-4" />
          <span>3D Node View</span>
          <span className="ml-2 text-xs text-gray-500">
            (Coming soon)
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="opacity-50 cursor-not-allowed inline-flex whitespace-nowrap text-xs">
          <span>Tree View</span>
          <span className="ml-2 text-xs text-gray-500">
            (Coming soon)
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}