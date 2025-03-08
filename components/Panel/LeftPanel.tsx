import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";

export default function LeftPanel({
  jsonInput,
  setJsonInput,
}: {
  jsonInput: any;
  setJsonInput: any;
}) {
  const [width, setWidth] = useState(40); // Initial width in percentage
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
      className="relative h-screen flex flex-col border-r border-gray-700"
      style={{ width: `${width}vw` }}
    >
      {/* Header with project name */}
      <div className="bg-[#1e1e1e] p-3 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">JSON Vue</h1>
      </div>
      {/* Editor container */}
      <div className="flex-grow relative">
        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          defaultLanguage="json"
          value={jsonInput}
          onChange={(e) => setJsonInput(e)}
          options={editorOptions as any}
        />

        {/* Placeholder overlay - only shown when jsonInput is empty */}
        {!jsonInput && (
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
