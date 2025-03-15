import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect, useCallback } from "react";
import JsonErrorMessage from "./JsonErrorMessage";
import { Play } from "lucide-react";
import { storageService } from "../../../../utils/storageService";
import { useJsonStore } from "../../../../store/useJsonStore";

export default function LeftPanel() {
  // Use the Zustand store instead of props
  const {
    jsonData,
    setJsonData,
    collapseLeftPanel,
    isValidJson,
    applyChangesToVisualization,
  } = useJsonStore();

  const [width, setWidth] = useState(20);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Add a state to track if we should show the placeholder
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // Editor options to disable minimap and customize other settings
  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    fontSize: 14,
    lineNumbers: "on",
    renderIndentGuides: true,
    tabSize: 2,
    stickyScroll: { enabled: false },
  };

  // Helper function to update placeholder visibility
  const updatePlaceholderVisibility = (content: string | undefined) => {
    const shouldShow = !content || content.trim() === "";
    setShowPlaceholder(shouldShow);
  };

  // Check for content on initial render and whenever jsonInput changes
  useEffect(() => {
    // Function to check if we have content
    const checkForContent = () => {
      // Check direct jsonInput prop
      if (jsonData && jsonData.trim() !== "") {
        setShowPlaceholder(false);
        return;
      }

      // If no direct jsonInput, check localStorage
      const storedData = storageService.getJsonData();
      if (
        storedData &&
        storedData.content &&
        storedData.content.trim() !== ""
      ) {
        setShowPlaceholder(false);
        return;
      }

      // No content found, show placeholder
      setShowPlaceholder(true);
    };

    // Run the check
    checkForContent();
  }, [jsonData]);

  // Handle editor content change
  const handleEditorChange = (value: string | undefined) => {
    setJsonData(value || "");

    // Update placeholder visibility based on content
    updatePlaceholderVisibility(value);
  };

  // Handle editor load complete
  const handleEditorDidMount = (editor: any) => {
    setIsEditorLoaded(true);

    // Disable bracket pair guides and other overlays directly on the editor instance
    editor.updateOptions({
      bracketPairColorization: { enabled: false },
      guides: { bracketPairs: false, indentation: false },
      renderLineHighlight: "none",
      occurrencesHighlight: false,
      folding: true,
      matchBrackets: "never",
      renderIndentGuides: false,
    });

    // Access the internal editor model and disable bracket pair guides
    const model = editor.getModel();
    if (model) {
      // This is a more direct way to disable bracket pair guides
      model._bracketPairColorizer?.dispose();
    }

    // Check again for content when editor mounts
    if (jsonData && jsonData.trim() !== "") {
      setShowPlaceholder(false);
    } else {
      // Double-check localStorage directly
      const storedData = storageService.getJsonData();
      if (
        storedData &&
        storedData.content &&
        storedData.content.trim() !== ""
      ) {
        setShowPlaceholder(false);
      }
    }
  };

  // Add effect to update placeholder when jsonData changes
  useEffect(() => {
    updatePlaceholderVisibility(jsonData);
  }, [jsonData]);

  // Add a state to track active resizing
  const [isResizing, setIsResizing] = useState(false);

  // Handle mouse move to resize - also wrap in useCallback first
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return;

    const containerWidth = document.body.clientWidth;
    const deltaX = e.clientX - startXRef.current;
    const deltaPercentage = (deltaX / containerWidth) * 100;

    // Calculate new width with constraints (min 20%, max 80%)
    const newWidth = Math.min(
      Math.max(startWidthRef.current + deltaPercentage, 20),
      40
    );
    setWidth(newWidth);
  }, []);

  // Then update handleMouseUp to include handleMouseMove in dependencies
  const handleMouseUp = useCallback(() => {
    resizingRef.current = false;
    setIsResizing(false); // Reset resizing state
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  // Handle mouse down to start resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    resizingRef.current = true;
    setIsResizing(true); // Set resizing state to true
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        collapseLeftPanel ? "w-0 opacity-0" : ""
      }`}
      style={{
        width: collapseLeftPanel ? "0" : `${width}vw`,
        maxWidth: collapseLeftPanel ? "0" : `${width}vw`,
      }}
    >
      <div
        ref={panelRef}
        className={`relative h-screen flex flex-col border-r border-gray-700 overflow-hidden transition-opacity duration-300 ${
          collapseLeftPanel ? "opacity-0" : "opacity-100"
        }`}
        style={{ width: `${width}vw` }}
      >
        <JsonErrorMessage
          isVisible={!isValidJson && jsonData !== "" && isEditorLoaded}
        />

        <div className="flex-grow relative overflow-hidden">
          {!isEditorLoaded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1e1e1e]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-400">Loading editor...</p>
              </div>
            </div>
          )}

          <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            defaultLanguage="json"
            value={jsonData}
            onChange={handleEditorChange}
            options={
              {
                ...editorOptions,
                padding: { top: 16, bottom: 16 },
              } as any
            }
            onMount={handleEditorDidMount}
            loading={null}
            className="monaco-editor-container"
          />

          {/* Conditionally render placeholder based on state */}
          {showPlaceholder && (
            <div
              ref={placeholderRef}
              className="absolute top-4 left-16 pointer-events-none z-10 text-gray-400"
            >
              <h3 className="text-md font-medium mb-2">Paste your JSON here</h3>
              <pre className="opacity-70 font-mono">
                {`{
      "example": "value",
      "numbers": 123,
      "boolean": true,
      "array": [1, 2, 3],
      "nested": {
        "key": "value"
      }
    }`}
              </pre>
            </div>
          )}
        </div>

        {/* Apply Changes button */}
        {isValidJson && jsonData && jsonData.trim() !== "" && (
          <div className="p-2 border-t border-gray-700 bg-gray-800">
            <button
              onClick={applyChangesToVisualization}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              <Play size={16} />
              <span>Apply Changes</span>
            </button>
          </div>
        )}

        {/* Resize handle */}
        <div
          className="absolute top-0 right-0 h-full z-30 cursor-col-resize group"
          style={{ width: "8px" }}
          onMouseDown={handleMouseDown}
        >
          {/* Visual indicator line */}
          <div
            className={`absolute right-0 h-full top-0 transition-all duration-150 ${
              isResizing
                ? "w-0.5 bg-blue-500"
                : "w-px bg-gray-700 group-hover:w-0.5 group-hover:bg-blue-500"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
