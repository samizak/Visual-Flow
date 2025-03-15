import React from "react";
import { Settings } from "lucide-react";
import { Button } from "../../ui/button";
import { useJsonStore } from "../../../store/useJsonStore";

export default function SettingsButton() {
  // Use the Zustand store directly
  const { setIsSettingsOpen } = useJsonStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsSettingsOpen(true)}
      title="Settings"
      className="text-gray-300 hover:text-white hover:bg-gray-800"
    >
      <Settings size={18} />
    </Button>
  );
}