import React from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJsonStore } from "@/store/useJsonStore";

export default function PanelToggle() {
  const { toggleLeftPanel } = useJsonStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLeftPanel}
      title="Toggle Panel"
      className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer focus:ring-0 focus:outline-none"
    >
      <PanelLeft size={18} />
    </Button>
  );
}
