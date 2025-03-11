import { useCallback, useRef } from "react";
import { successToast, errorToast } from "../lib/toast";

interface UseFileOperationsProps {
  setJsonData: (data: string) => void;
  onSuccessfulLoad?: (content: string) => void;
}

export function useFileOperations({ setJsonData, onSuccessfulLoad }: UseFileOperationsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    (files: FileList) => {
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
          // Call the callback if provided
          if (onSuccessfulLoad) {
            onSuccessfulLoad(content);
          }
          successToast(`File "${file.name}" loaded successfully`);
        } catch (error) {
          errorToast("Invalid JSON file. Please check the file format.");
        }
      };
      reader.readAsText(file);
    },
    [setJsonData, onSuccessfulLoad]
  );

  const importFile = useCallback(() => {
    // Create a file input element if it doesn't exist
    if (!fileInputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      fileInputRef.current = input;
    }

    // Set up the change event handler
    fileInputRef.current.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    };

    // Trigger the file dialog
    fileInputRef.current.click();
  }, [handleFiles]);

  return { handleFiles, importFile };
}