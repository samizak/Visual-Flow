import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface HeaderProps {
  onFormat?: () => void;
  onMinimize?: () => void;
  onCopy?: () => void;
  onTogglePanel?: () => void;
  onSave?: () => void;
  onImport?: () => void;
  edgeStyle?: string;
  onEdgeStyleChange: (style: string) => void;
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
}: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleEdgeStyleChange = (value: string) => {
    onEdgeStyleChange(value);
    toast.success("Style successfully changed");
  };

  return (
    <header className="bg-[#1e1e1e] border-b border-gray-700 py-1 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePanel}
            className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
            title="Collapse Panel"
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
              <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
                <DropdownMenuLabel>File Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSave}>
                  <Save className="mr-2 h-4 w-4" />
                  <span>Save</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Import</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Export</span>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <FileCode className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
                <DropdownMenuLabel>Edit Options</DropdownMenuLabel>
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
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1e1e1e] border border-gray-700 shadow-lg z-50">
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
                <DropdownMenuItem>
                  <span>Tree View</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-[#1e1e1e] border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edge-style" className="text-right">
                Edge Style
              </Label>
              <div className="col-span-3">
                <Select value={edgeStyle} onValueChange={handleEdgeStyleChange}>
                  <SelectTrigger
                    className="w-full bg-[#2d2d2d] border-gray-700 text-white focus:ring-offset-0 focus:ring-gray-500"
                    id="edge-style"
                  >
                    <SelectValue placeholder="Select edge style" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-[#2d2d2d] border-gray-700 text-white"
                    position="popper"
                  >
                    <SelectItem
                      value="smoothstep"
                      className="focus:bg-gray-700 focus:text-white"
                    >
                      Stepline
                    </SelectItem>
                    <SelectItem
                      value="default"
                      className="focus:bg-gray-700 focus:text-white"
                    >
                      Bezier
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSettingsOpen(false)}
              className="bg-[#2d2d2d] border-gray-700 hover:bg-gray-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
