import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export default function LeftPanel({
  jsonInput,
  setJsonInput,
}: {
  jsonInput: any;
  setJsonInput: any;
}) {
  const [width, setWidth] = useState(30); // Initial width in percentage
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
  };

  // Handle editor load complete
  const handleEditorDidMount = () => {
    setIsEditorLoaded(true);
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
    <div
      ref={panelRef}
      className="relative h-screen flex flex-col border-r border-gray-700 overflow-hidden"
      style={{ width: `${width}vw` }}
    >
      {/* Header with project name */}
      <div className="bg-[#1e1e1e] p-3 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
        <h1 className="text-xl font-semibold text-white">JSON Vue</h1>

        <div className="flex space-x-2">
          {/* Format button */}
          <button
            onClick={() => {
              try {
                // Format JSON with 2 spaces indentation
                const formatted = JSON.stringify(
                  JSON.parse(jsonInput),
                  null,
                  2
                );
                setJsonInput(formatted);
              } catch (e) {
                // Handle invalid JSON
                console.error("Invalid JSON");
              }
            }}
            className="px-3 py-1 text-xs bg-[#2d2d2d] hover:bg-[#3a3a3a] text-gray-300 rounded flex items-center transition-colors duration-200"
            title="Format JSON"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Format
          </button>

          {/* Minify button */}
          <button
            onClick={() => {
              try {
                // Minify JSON by removing all whitespace
                const minified = JSON.stringify(JSON.parse(jsonInput));
                setJsonInput(minified);
              } catch (e) {
                // Handle invalid JSON
                console.error("Invalid JSON");
              }
            }}
            className="px-3 py-1 text-xs bg-[#2d2d2d] hover:bg-[#3a3a3a] text-gray-300 rounded flex items-center transition-colors duration-200"
            title="Minify JSON"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Minify
          </button>
          {/* Copy button */}
          <button
            onClick={() => {
              try {
                // Copy JSON to clipboard
                navigator.clipboard.writeText(jsonInput);
                toast.success("JSON copied to clipboard", {
                  position: "bottom-center",
                  duration: 2000,
                  icon: "📋",
                  description: "The content has been copied to your clipboard",
                });
              } catch (e) {
                // Handle clipboard error
                console.error("Failed to copy");
                toast.error("Failed to copy to clipboard", {
                  position: "bottom-center",
                  duration: 2000,
                  icon: "❌",
                  description: "Please try again",
                });
              }
            }}
            className="px-3 py-1 text-xs bg-[#2d2d2d] hover:bg-[#3a3a3a] text-gray-300 rounded flex items-center transition-colors duration-200"
            title="Copy to clipboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy
          </button>
        </div>
      </div>

      {/* Rest of your component remains unchanged */}
      {/* Editor container with padding bottom to prevent overflow */}
      <div
        className="flex-grow relative overflow-hidden pb-4"
        style={{ height: "calc(100vh - 56px)" }}
      >
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
          className="monaco-editor-container"
        />

        {/* Placeholder overlay - only shown when jsonInput is empty AND editor is loaded */}
        {!jsonInput && isEditorLoaded && (
          <div className="absolute top-0 left-12 right-0 bottom-0 pointer-events-none flex items-center justify-center z-10">
            <div className="text-gray-400 max-w-md bg-[#1e1e1e] bg-opacity-80 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-2">Paste your JSON here</h3>
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
  );
}
