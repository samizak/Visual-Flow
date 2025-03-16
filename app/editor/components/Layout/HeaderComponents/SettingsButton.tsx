import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJsonStore } from "@/store/useJsonStore";

export default function SettingsButton() {
  const { setIsSettingsOpen } = useJsonStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsSettingsOpen(true)}
      title="Settings"
      className="text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-0 focus:outline-none"
    >
      <Settings size={18} />
    </Button>
  );
}
