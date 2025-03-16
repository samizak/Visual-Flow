import { useState, useRef, useCallback } from "react";
import { infoToast, errorToast } from "../lib/toast";
import { validateJsonAgainstFreeLimits } from "../constants/limits";

interface UseDragAndDropProps {
  onFilesDrop: (files: FileList) => void;
  isPremiumUser?: boolean;
}

export function useDragAndDrop({ onFilesDrop, isPremiumUser = false }: UseDragAndDropProps) {
  const [isFileDragging, setIsFileDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const dragCounterRef = useRef(0);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current++;

    if (e.dataTransfer.types.includes("Files")) {
      setIsFileDragging(true);

      const items = e.dataTransfer.items;
      if (items && items.length > 0) {
        if (items[0].kind === "file" && items[0].type === "application/json") {
          setDragError(null);
        } else {
          const fileType = items[0].type || "unknown";
          setDragError(`File type not supported: ${fileType}`);
        }
      }
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Decrement counter when drag leaves any element
    dragCounterRef.current--;

    // Only hide the overlay when we've left all elements
    if (dragCounterRef.current === 0) {
      setIsFileDragging(false);
      setDragError(null); // Clear any error when drag ends
    }
  }, []);

  // Check if the JSON content exceeds free user limits
  const checkFreeLimits = useCallback(async (file: File): Promise<{ isValid: boolean; message?: string }> => {
    // Premium users bypass all checks - make this explicit
    if (isPremiumUser === true) {
      console.log("Premium user detected, bypassing all checks");
      return { isValid: true };
    }
    
    try {
      // Read the file content
      const content = await file.text();
      
      // Use the shared validation function - explicitly pass isPremiumUser
      const validation = validateJsonAgainstFreeLimits(content, isPremiumUser);
      
      return {
        isValid: validation.isValid,
        message: validation.message
      };
    } catch (e) {
      return { isValid: false, message: "Error reading file" };
    }
  }, [isPremiumUser]);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      dragCounterRef.current = 0;
      setIsFileDragging(false);
      
      const files = e.dataTransfer.files;
      
      if (files && files.length > 0) {
        // Check if it's a JSON file
        if (files[0].type === "application/json" || files[0].name.endsWith('.json')) {
          // Premium users bypass all checks - make this explicit and add logging
          if (isPremiumUser === true) {
            console.log("Premium user detected in handleDrop, bypassing all checks");
            // Directly process the file for premium users
            onFilesDrop(files);
            return;
          }
          
          // For free users, check file against limits
          const { isValid, message } = await checkFreeLimits(files[0]);
          
          if (!isValid) {
            setDragError(message || "Error processing file");
            
            try {
              // Try to parse the file to check if it's valid JSON
              const content = await files[0].text();
              JSON.parse(content); // This will throw if invalid
              
              // If we get here, it's valid JSON but exceeds limits
              errorToast(`${message}. Upgrade for more!`);
            } catch (e) {
              // It's an invalid JSON format error
              errorToast(message || "Invalid JSON format");
            }
            
            // Auto-hide the error after 3 seconds
            setTimeout(() => {
              setDragError(null);
            }, 3000);
            
            return;
          }
          
          // If we get here, the file is valid for the user's plan
          onFilesDrop(files);
        } else {
          setDragError("Only JSON files are supported");
          errorToast("Only JSON files are supported");
          // Auto-hide the error after 3 seconds
          setTimeout(() => {
            setDragError(null);
          }, 3000);
        }
      }
    },
    [onFilesDrop, isPremiumUser, checkFreeLimits]
  );

  return {
    isFileDragging,
    dragError,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}
