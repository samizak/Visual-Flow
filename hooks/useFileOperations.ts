import { useCallback, useRef } from "react";
import { successToast, errorToast } from "../lib/toast";
import { validateJsonAgainstFreeLimits } from "../constants/limits";
import { useSupabase } from "../components/Auth/SupabaseProvider";

interface UseFileOperationsProps {
  setJsonData: (data: string) => void;
  onSuccessfulLoad?: (content: string) => void;
}

export function useFileOperations({
  setJsonData,
  onSuccessfulLoad,
}: UseFileOperationsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { isPro } = useSupabase(); // Get premium status

  const handleFiles = useCallback(
    (files: FileList) => {
      const file = files[0];

      // Check if file is a JSON file
      if (!file.name.toLowerCase().endsWith(".json")) {
        errorToast("Only JSON files are currently supported");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Try to parse the JSON to validate it
          JSON.parse(content);
          
          // For free users, validate against limits
          if (!isPro) {
            const validation = validateJsonAgainstFreeLimits(content, isPro);
            if (!validation.isValid) {
              // Only add "Upgrade for more!" if it's not a format error
              const errorMessage = validation.isFormatError
                ? validation.message
                : `${validation.message}. Upgrade for more!`;
                
              errorToast(errorMessage || "Error validating JSON");
              return;
            }
          }
          
          // If validation passes or user is premium, update the content
          setJsonData(content);
          // Call the callback if provided
          if (onSuccessfulLoad) {
            onSuccessfulLoad(content);
          }
          successToast(`File "${file.name}" loaded successfully`);
        } catch (error) {
          errorToast("Invalid JSON file. Please check for errors.");
        }
      };
      reader.readAsText(file);
    },
    [setJsonData, onSuccessfulLoad, isPro]
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
