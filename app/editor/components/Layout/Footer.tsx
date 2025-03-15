import { Check, X, Save, BarChart2, AlertCircle } from "lucide-react";
import { storageService } from "../../../../utils/storageService";
import { useEffect, useState } from "react";
import { useJsonStore } from "../../../../store/useJsonStore";

export default function Footer() {
  // Get isValidJson and nodeCount from the store
  const { isValidJson, nodeCount } = useJsonStore();

  // Use state to track auto-save setting
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [jsonStatus, setJsonStatus] = useState<{
    status: "valid" | "invalid" | "empty";
    message: string;
  }>({ status: "empty", message: "No JSON" });

  // Load auto-save setting on component mount and when localStorage changes
  useEffect(() => {
    const settings = storageService.getSettings();
    setAutoSaveEnabled(settings.autoSaveEnabled !== false);

    // Listen for storage events to update when changed in other components
    const handleStorageChange = () => {
      const updatedSettings = storageService.getSettings();
      setAutoSaveEnabled(updatedSettings.autoSaveEnabled !== false);
    };
    window.addEventListener("settings-changed", handleStorageChange);

    return () => {
      window.removeEventListener("settings-changed", handleStorageChange);
    };
  }, []);

  // Update JSON status based on isValidJson and nodeCount
  useEffect(() => {
    if (nodeCount === 0) {
      setJsonStatus({ status: "empty", message: "No JSON" });
    } else if (isValidJson) {
      setJsonStatus({ status: "valid", message: "Valid JSON" });
    } else {
      setJsonStatus({ status: "invalid", message: "Invalid JSON" });
    }
  }, [isValidJson, nodeCount]);

  return (
    <div className="h-7 bg-[#1e1e1e] border-t border-gray-700 flex items-center justify-between px-4 text-sm">
      <div className="flex items-center divide-x divide-gray-700">
        {/* JSON Status */}
        <div className="flex items-center pr-4">
          <div
            className={`flex items-center gap-1.5 ${
              jsonStatus.status === "valid"
                ? "text-green-500"
                : jsonStatus.status === "invalid"
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {jsonStatus.status === "valid" ? (
              <Check className="w-3.5 h-3.5" />
            ) : jsonStatus.status === "invalid" ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span className="font-medium">{jsonStatus.message}</span>
          </div>
        </div>

        {/* Auto Save Status */}
        <div className="flex items-center gap-1.5 px-4">
          <Save
            className={`w-3.5 h-3.5 ${
              autoSaveEnabled ? "text-green-400" : "text-gray-500"
            }`}
          />
          <span
            className={`${
              autoSaveEnabled ? "text-green-400" : "text-gray-500"
            } font-medium`}
          >
            {autoSaveEnabled ? "Auto Save" : "Auto Save Off"}
          </span>
        </div>

        {/* Node Count */}
        <div className="flex items-center gap-1.5 pl-4">
          <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-400 font-medium">
            {nodeCount} {nodeCount === 1 ? "Node" : "Nodes"}
          </span>
        </div>
      </div>

      {/* Version info */}
      <div className="text-gray-500 text-xs">Visual Flow v1.0</div>
    </div>
  );
}
