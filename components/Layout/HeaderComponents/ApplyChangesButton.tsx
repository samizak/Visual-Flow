import React from "react";
import { Play } from "lucide-react";
import { Button } from "../../ui/button";

interface ApplyChangesButtonProps {
  onClick?: () => void;
}

export default function ApplyChangesButton({ onClick }: ApplyChangesButtonProps) {
  if (!onClick) return null;
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="bg-indigo-600 hover:bg-indigo-700 text-white border-none hover:text-white transition-colors"
    >
      <Play className="mr-1 h-4 w-4" />
      Apply Changes
    </Button>
  );
}