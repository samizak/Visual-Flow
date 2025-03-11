import { useState, useRef, useEffect, useCallback } from "react";

export function useMouseInteractions() {
  const [isDragging, setIsDragging] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
    if (mainRef.current) {
      mainRef.current.classList.add("no-select");
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (mainRef.current) {
      mainRef.current.classList.remove("no-select");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);

  return {
    isDragging,
    mainRef,
    handleMouseDown
  };
}