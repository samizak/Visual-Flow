import React from "react";
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
import { Button } from "../ui/button";
import { successToast } from "../../lib/toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edgeStyle?: string;
  onEdgeStyleChange: (style: string) => void;
}

export default function SettingsDialog({
  open,
  onOpenChange,
  edgeStyle = "default",
  onEdgeStyleChange,
}: SettingsDialogProps) {
  const handleEdgeStyleChange = (value: string) => {
    // Remove console.log and ensure we're passing the new value
    if (value !== edgeStyle) {
      onEdgeStyleChange(value);
      successToast("Style successfully changed");
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
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edge-style" className="text-right">
              Edge Style
            </Label>
            <div className="col-span-3">
              <Select
                value={edgeStyle}
                onValueChange={handleEdgeStyleChange}
                // Remove defaultValue as it can conflict with the value prop
              >
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
