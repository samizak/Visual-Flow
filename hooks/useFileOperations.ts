import { useCallback } from "react";
import { successToast, errorToast } from "../lib/toast";

interface UseFileOperationsProps {
  setJsonData: (data: string) => void;
}

export function useFileOperations({ setJsonData }: UseFileOperationsProps) {
  const handleFiles = useCallback((files: FileList) => {
    const file = files[0];
    
    // Check if file is a JSON file
    if (!file.name.toLowerCase().endsWith('.json')) {
      errorToast("Only JSON files are currently supported");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Try to parse the JSON to validate it
        JSON.parse(content);
        setJsonData(content);
        successToast(`File "${file.name}" loaded successfully`);
      } catch (error) {
        errorToast("Invalid JSON file. Please check the file format.");
      }
    };
    reader.onerror = () => {
      errorToast("Error reading file");
    };
    reader.readAsText(file);
  }, [setJsonData]);

  const importFile = useCallback(() => {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json";

    // Handle file selection
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          // Try to parse to validate it's proper JSON
          JSON.parse(content);
          // Set the JSON data
          setJsonData(content);
          successToast("JSON imported successfully");
        } catch (error) {
          errorToast("Invalid JSON file");
          console.error("Error parsing JSON file:", error);
        }
      };

      reader.onerror = () => {
        errorToast("Failed to read file");
      };

      reader.readAsText(file);
    };

    // Trigger the file input click
    fileInput.click();
  }, [setJsonData]);

  return {
    handleFiles,
    importFile
  };
}