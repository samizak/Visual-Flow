import { useState, useEffect, useCallback } from "react";
import { successToast, errorToast } from "../lib/toast";

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
        
        // Only update if the content is actually different
        if (formattedJson !== jsonData) {
          // Use a flag to indicate this is just a formatting change
          setJsonData(formattedJson);
          successToast("JSON formatted successfully");
        }
      }
    } catch (e) {
      errorToast("Cannot format invalid JSON");
    }
  }, [jsonData]);

  const minimizeJson = useCallback(() => {
    try {
      if (jsonData.trim()) {
        const parsedJson = JSON.parse(jsonData);
        const minimizedJson = JSON.stringify(parsedJson);
        
        // Only update if the content is actually different
        if (minimizedJson !== jsonData) {
          // Use a flag to indicate this is just a formatting change
          setJsonData(minimizedJson);
          successToast("JSON minimized successfully");
        }
      }
    } catch (e) {
      errorToast("Cannot minimize invalid JSON");
    }
  }, [jsonData]);

  const copyJson = useCallback(() => {
    if (jsonData.trim()) {
      navigator.clipboard
        .writeText(jsonData)
        .then(() => successToast("JSON copied to clipboard"))
        .catch((err) => {
          errorToast("Failed to copy JSON to clipboard");
          console.error("Failed to copy: ", err);
        });
    }
  }, [jsonData]);

  const saveJson = useCallback(() => {
    // Check if JSON data is empty or only contains whitespace
    if (!jsonData || !jsonData.trim()) {
      errorToast("Cannot save empty JSON");
      return;
    }
    
    // Check if JSON is valid before saving
    try {
      JSON.parse(jsonData);
      
      const blob = new Blob([jsonData], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "data.json";
      link.click();
      URL.revokeObjectURL(link.href);
      successToast("JSON saved to file");
    } catch (e) {
      errorToast("Cannot save invalid JSON");
    }
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