import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useJsonOperations() {
  const [jsonData, setJsonData] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState(true);

  // Validate JSON whenever it changes
  useEffect(() => {
    if (jsonData.trim() === "") {
      setIsValidJson(true);
      return;
    }
    try {
      if (jsonData.trim()) {
        // Actually parse the JSON to validate it
        JSON.parse(jsonData);
        setIsValidJson(true);
      } else {
        setIsValidJson(false);
      }
    } catch (e) {
      setIsValidJson(false);
    }
  }, [jsonData]);

  const formatJson = useCallback(() => {
    try {
      if (jsonData.trim()) {
        const parsedJson = JSON.parse(jsonData);
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        setJsonData(formattedJson);
        toast.success("JSON formatted successfully");
      }
    } catch (e) {
      toast.error("Cannot format invalid JSON");
    }
  }, [jsonData]);

  const minimizeJson = useCallback(() => {
    try {
      if (jsonData.trim()) {
        const parsedJson = JSON.parse(jsonData);
        const minimizedJson = JSON.stringify(parsedJson);
        setJsonData(minimizedJson);
        toast.success("JSON minimized successfully");
      }
    } catch (e) {
      toast.error("Cannot minimize invalid JSON");
    }
  }, [jsonData]);

  const copyJson = useCallback(() => {
    if (jsonData.trim()) {
      navigator.clipboard
        .writeText(jsonData)
        .then(() => toast.success("JSON copied to clipboard"))
        .catch((err) => {
          toast.error("Failed to copy JSON to clipboard");
          console.error("Failed to copy: ", err);
        });
    }
  }, [jsonData]);

  const saveJson = useCallback(() => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }, [jsonData]);

  return {
    jsonData,
    setJsonData,
    isValidJson,
    formatJson,
    minimizeJson,
    copyJson,
    saveJson
  };
}