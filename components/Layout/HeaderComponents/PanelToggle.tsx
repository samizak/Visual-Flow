import React from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "../../ui/button";

interface PanelToggleProps {
  onTogglePanel?: () => void;
  collapseLeftPanel?: boolean;
}

export default function PanelToggle({ onTogglePanel, collapseLeftPanel = false }: PanelToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onTogglePanel}
      className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
      title={collapseLeftPanel ? "Expand Editor" : "Collapse Editor"}
    >
      <PanelLeft
        className={`h-5 w-5 transition-transform duration-300 ${
          collapseLeftPanel ? "rotate-180" : ""
        }`}
      />
    </Button>
  );
}