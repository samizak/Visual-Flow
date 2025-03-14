import { useState, useEffect, useCallback } from "react";
import { successToast, errorToast, infoToast } from "../lib/toast";
import { 
  FREE_LIMITS, 
  validateJsonAgainstFreeLimits,
  generateLimitsExceededMessage
} from "../constants/limits";

export function useJsonOperations(isPremiumUser: boolean = false) {
  const [jsonData, setJsonData] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState(true);
  const [exceedsFreeLimits, setExceedsFreeLimits] = useState(false);
  const [limitDetails, setLimitDetails] = useState<{
    lines: number;
    nodes: number;
    depth: number;
    size: number;
  }>({ lines: 0, nodes: 0, depth: 0, size: 0 });

  // Validate JSON whenever it changes
  useEffect(() => {
    if (jsonData.trim() === "") {
      setIsValidJson(true);
      setExceedsFreeLimits(false);
      setLimitDetails({ lines: 0, nodes: 0, depth: 0, size: 0 });
      return;
    }
    
    try {
      if (jsonData.trim()) {
        // Actually parse the JSON to validate it
        JSON.parse(jsonData);
        setIsValidJson(true);
        
        // Only check limits for free users
        if (!isPremiumUser) {
          const validation = validateJsonAgainstFreeLimits(jsonData, isPremiumUser);
          
          if (validation.details) {
            setLimitDetails(validation.details);
          }
          
          setExceedsFreeLimits(!validation.isValid);
          
          // Show a toast if limits are exceeded
          if (!validation.isValid && validation.details) {
            infoToast(generateLimitsExceededMessage(validation.details));
          }
        }
      } else {
        setIsValidJson(false);
      }
    } catch (e) {
      setIsValidJson(false);
    }
  }, [jsonData, isPremiumUser]);

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
    saveJson,
    exceedsFreeLimits,
    limitDetails,
  };
}
