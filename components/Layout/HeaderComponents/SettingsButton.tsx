import React from "react";
import { Settings } from "lucide-react";
import { Button } from "../../ui/button";

interface SettingsButtonProps {
  onClick: () => void;
}

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
      title="Settings"
    >
      <Settings className="mr-1 h-4 w-4" />
      Settings
    </Button>
  );
}