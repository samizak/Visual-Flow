import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";
import JsonErrorMessage from "./JsonErrorMessage";

export default function LeftPanel({
  jsonInput,
  setJsonInput,
  collapseLeftPanel,
  isValidJson = true,
}: {
  jsonInput: any;
  setJsonInput: any;
  collapseLeftPanel: boolean;
  isValidJson?: boolean;
}) {
  const [width, setWidth] = useState(20);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

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
  };

  // Handle mouse down to start resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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

  // Handle mouse up to stop resizing
  const handleMouseUp = () => {
    resizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
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
        {/* Error message component */}
        <JsonErrorMessage
          isVisible={!isValidJson && jsonInput !== "" && isEditorLoaded}
        />

        <div className="flex-grow relative overflow-hidden pb-16">
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
            onChange={(e) => setJsonInput(e)}
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

          {/* Placeholder overlay */}
          {!jsonInput && isEditorLoaded && (
            <div className="absolute top-0 left-12 right-0 bottom-0 pointer-events-none flex items-center justify-center z-10">
              <div className="text-gray-400 max-w-md bg-[#1e1e1e] bg-opacity-80 p-6 rounded-md">
                <h3 className="text-lg font-medium mb-2">
                  Paste your JSON here
                </h3>
                <pre className="text-sm opacity-70 font-mono">
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
          )}
        </div>

        {/* Resize handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full bg-gray-700 cursor-col-resize hover:bg-blue-500 z-10"
          onMouseDown={handleMouseDown}
        />
      </div>
    )
  );
}
