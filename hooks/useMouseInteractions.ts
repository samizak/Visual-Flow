import { useState, useRef, useEffect, useCallback } from "react";

export function useMouseInteractions() {
  const mainRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    if (mainRef.current) {
      mainRef.current.classList.add("no-select");
    }
  }, []);

  const handleMouseUp = useCallback(() => {
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
    mainRef,
    handleMouseDown,
  };
}
