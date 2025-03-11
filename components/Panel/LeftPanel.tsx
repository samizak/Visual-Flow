import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";
import JsonErrorMessage from "./JsonErrorMessage";
import { Play } from "lucide-react";

export default function LeftPanel({
  jsonInput,
  setJsonInput,
  collapseLeftPanel,
  isValidJson = true,
  onApplyChanges,
}: {
  jsonInput: any;
  setJsonInput: any;
  collapseLeftPanel: boolean;
  isValidJson?: boolean;
  onApplyChanges?: () => void;
}) {
  const [width, setWidth] = useState(20);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

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

    // Show placeholder if editor is empty
    updatePlaceholderVisibility(jsonInput);
  };

  // Handle editor content change
  const handleEditorChange = (value: string | undefined) => {
    if (setJsonInput) {
      setJsonInput(value || "");
    }

    // Show/hide placeholder based on content
    updatePlaceholderVisibility(value);
  };

  // Helper function to update placeholder visibility
  const updatePlaceholderVisibility = (content: string | undefined) => {
    if (placeholderRef.current) {
      placeholderRef.current.style.display = content ? "none" : "block";
    }
  };

  // Add effect to update placeholder when jsonInput changes
  useEffect(() => {
    updatePlaceholderVisibility(jsonInput);
  }, [jsonInput]);

  // Add a state to track active resizing
  const [isResizing, setIsResizing] = useState(false);

  // Handle mouse down to start resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    resizingRef.current = true;
    setIsResizing(true); // Set resizing state to true
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse up to stop resizing
  const handleMouseUp = () => {
    resizingRef.current = false;
    setIsResizing(false); // Reset resizing state
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse move to resize
  const handleMouseMove = (e: MouseEvent) => {
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
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    !collapseLeftPanel && (
      <div
        ref={panelRef}
        className="relative h-screen flex flex-col border-r border-gray-700 overflow-hidden"
        style={{ width: `${width}vw` }}
      >
        <JsonErrorMessage
          isVisible={!isValidJson && jsonInput !== "" && isEditorLoaded}
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
            value={jsonInput}
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

          <div
            ref={placeholderRef}
            className="absolute top-4 left-16 pointer-events-none z-10 text-gray-400"
            style={{ display: "none" }}
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
        </div>

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

        {/* Apply Changes button at the bottom of the panel */}
        {onApplyChanges && (
          <div className="p-2 border-t border-gray-700 bg-[#252525]">
            <button
              onClick={onApplyChanges}
              disabled={!isValidJson}
              className={`w-full py-1.5 px-3 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                isValidJson
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Play className="h-4 w-4" />
              Apply Changes
            </button>
          </div>
        )}
      </div>
    )
  );
}
