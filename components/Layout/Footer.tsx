import { Check, X } from "lucide-react";

export default function Footer({
  isValidJson,
  nodeCount,
}: {
  isValidJson: boolean;
  nodeCount: number;
}) {
  return (
    <div className="h-6 bg-[#1e1e1e] border-t border-gray-700 flex items-center justify-between px-4 text-sm">
      <div className="flex items-center">
        <span className="mr-2">JSON Status:</span>
        {isValidJson ? (
          <div className="flex items-center gap-1 text-green-500">
            <Check className="w-4 h-4" />
            <span>Valid</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-500">
            <X className="h-4 w-4" />
            <span>Invalid</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-gray-400">Total Nodes:</span>
        <span className="text-white">{nodeCount}</span>
      </div>
    </div>
  );
}
