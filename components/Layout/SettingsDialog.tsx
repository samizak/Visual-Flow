import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { successToast } from "../../lib/toast";
import { Grid, LineChart, Save } from "lucide-react";
import { Switch } from "../ui/switch";
import { storageService } from "../../utils/storageService";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edgeStyle?: string;
  onEdgeStyleChange: (style: string) => void;
  showGrid?: boolean;
  onToggleGrid?: (show: boolean) => void;
}

// Add this helper function before the component
function getEdgeStyleDisplayName(style: string): string {
  switch (style) {
    case "smoothstep":
      return "Stepline";
    case "default":
      return "Bezier";
    default:
      return style;
  }
}

export default function SettingsDialog({
  open,
  onOpenChange,
  edgeStyle = "default",
  onEdgeStyleChange,
  showGrid = true,
  onToggleGrid,
}: SettingsDialogProps) {
  const [gridValue, setGridValue] = useState(showGrid ? "true" : "false");

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    return storageService.getSettings().autoSaveEnabled !== false;
  });

  // Update local state when props change
  useEffect(() => {
    setGridValue(showGrid ? "true" : "false");
  }, [showGrid]);

  const handleEdgeStyleChange = (value: string) => {
    if (value !== edgeStyle) {
      onEdgeStyleChange(value);
      successToast("Style successfully changed");
    }
  };

  const handleGridDisplayChange = (value: string) => {
    if (onToggleGrid) {
      setGridValue(value); // Update local state immediately
      const showGridValue = value === "true";
      if (showGridValue !== showGrid) {
        onToggleGrid(showGridValue);
        successToast(`Grid display ${showGridValue ? "enabled" : "disabled"}`);
      }
    }
  };

  // Add handler for auto-save toggle
  const handleAutoSaveChange = (enabled: boolean) => {
    setAutoSaveEnabled(enabled);
    storageService.saveSettings({ autoSaveEnabled: enabled });
    window.dispatchEvent(new Event("settings-changed"));
    successToast(`Auto-save ${enabled ? "enabled" : "disabled"}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1e1e1e] border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Customize your visualization settings
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* Edge Style Setting */}
          <div className="grid grid-cols-4 items-center gap-8">
            <Label
              htmlFor="edge-style"
              className="text-left flex items-center gap-2 whitespace-nowrap"
            >
              <div className="flex items-center justify-center w-6">
                <LineChart className="h-4 w-4" strokeWidth={2} />
              </div>
              Edge Style
            </Label>
            <div className="col-span-3">
              <Select value={edgeStyle} onValueChange={handleEdgeStyleChange}>
                <SelectTrigger
                  className="w-full bg-[#2d2d2d] border-gray-700 text-white focus:ring-offset-0 focus:ring-gray-500"
                  id="edge-style"
                >
                  <SelectValue
                    placeholder={getEdgeStyleDisplayName(edgeStyle)}
                  />
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

          {/* Grid Display Setting */}
          <div className="grid grid-cols-4 items-center gap-8">
            <Label
              htmlFor="grid-display"
              className="text-left flex items-center gap-2 whitespace-nowrap"
            >
              <div className="flex items-center justify-center w-6">
                <Grid className="h-4 w-4" strokeWidth={2} />
              </div>
              Display Grid
            </Label>
            <div className="col-span-3">
              <Select value={gridValue} onValueChange={handleGridDisplayChange}>
                <SelectTrigger
                  className="w-full bg-[#2d2d2d] border-gray-700 text-white focus:ring-offset-0 focus:ring-gray-500"
                  id="grid-display"
                >
                  <SelectValue
                    placeholder={gridValue === "true" ? "Enabled" : "Disabled"}
                  />
                </SelectTrigger>
                <SelectContent
                  className="bg-[#2d2d2d] border-gray-700 text-white"
                  position="popper"
                >
                  <SelectItem
                    value="true"
                    className="focus:bg-gray-700 focus:text-white"
                  >
                    Enabled
                  </SelectItem>
                  <SelectItem
                    value="false"
                    className="focus:bg-gray-700 focus:text-white"
                  >
                    Disabled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Auto-save Setting - Updated to match other settings */}
          <div className="grid grid-cols-4 items-center gap-8">
            <Label
              htmlFor="autosave"
              className="text-left flex items-center gap-2 whitespace-nowrap"
            >
              <div className="flex items-center justify-center w-6">
                <Save className="h-4 w-4" strokeWidth={2} />
              </div>
              Auto-save
            </Label>
            <div className="col-span-3">
              <Select
                value={autoSaveEnabled ? "true" : "false"}
                onValueChange={(value) =>
                  handleAutoSaveChange(value === "true")
                }
              >
                <SelectTrigger
                  className="w-full bg-[#2d2d2d] border-gray-700 text-white focus:ring-offset-0 focus:ring-gray-500"
                  id="autosave"
                >
                  <SelectValue
                    placeholder={autoSaveEnabled ? "Enabled" : "Disabled"}
                  />
                </SelectTrigger>
                <SelectContent
                  className="bg-[#2d2d2d] border-gray-700 text-white"
                  position="popper"
                >
                  <SelectItem
                    value="true"
                    className="focus:bg-gray-700 focus:text-white"
                  >
                    Enabled
                  </SelectItem>
                  <SelectItem
                    value="false"
                    className="focus:bg-gray-700 focus:text-white"
                  >
                    Disabled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-[#2d2d2d] border-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-md"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
