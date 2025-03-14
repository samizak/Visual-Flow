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
import { Grid, LineChart } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edgeStyle?: string;
  onEdgeStyleChange: (style: string) => void;
  showGrid?: boolean;
  onToggleGrid?: (show: boolean) => void;
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

  // Get display name for edge style
  const getEdgeStyleDisplayName = (style: string) => {
    switch (style) {
      case "smoothstep":
        return "Stepline";
      case "default":
        return "Bezier";
      default:
        return style;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1e1e1e] border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className="" />
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* Edge Style Setting - No changes needed here */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="edge-style"
              className="text-left flex items-center gap-2"
            >
              <LineChart className="h-4 w-4" />
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

          {/* Grid Display Setting - Updated to use local state */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="grid-display"
              className="text-left flex items-center gap-2"
            >
              <Grid className="h-4 w-4" />
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
