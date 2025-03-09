import React from "react";
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
  Download,
  LayoutGrid,
  Layers,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  onFormat?: () => void;
  onMinimize?: () => void;
  onCopy?: () => void;
  onTogglePanel?: () => void;
}

export default function Header({
  onFormat,
  onMinimize,
  onCopy,
  onTogglePanel,
}: HeaderProps) {
  return (
    <header className="bg-[#1e1e1e] border-b border-gray-700 py-1 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePanel}
            className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
            title="Toggle Panel"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          <div className="h-5 w-px bg-gray-600 mx-0.5"></div>

          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <FileIcon className="mr-1 h-4 w-4" />
                  File
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>File Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onFormat}>
                  <FileCode className="mr-2 h-4 w-4" />
                  <span>Format JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onMinimize}>
                  <Minimize className="mr-2 h-4 w-4" />
                  <span>Minimize JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy JSON</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Save className="mr-2 h-4 w-4" />
                  <span>Save</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Import</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Export</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>View Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  <span>Diagram View</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Layers className="mr-2 h-4 w-4" />
                  <span>3D Node View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
