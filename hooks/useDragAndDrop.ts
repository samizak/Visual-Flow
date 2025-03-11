import { useState, useRef, useCallback } from "react";

interface UseDragAndDropProps {
  onFilesDrop: (files: FileList) => void;
}

export function useDragAndDrop({ onFilesDrop }: UseDragAndDropProps) {
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

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Reset counter and state
      dragCounterRef.current = 0;
      setIsFileDragging(false);
      setDragError(null);

      const files = e.dataTransfer.files;
      if (files.length) {
        onFilesDrop(files);
      }
    },
    [onFilesDrop]
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
