import React from "react";

// Code editor component with syntax highlighting
export default function CodeEditor({
  code,
  language = "json",
}: {
  code: any;
  language?: string;
}) {
  const formattedCode =
    typeof code === "object" ? JSON.stringify(code, null, 2) : code;

  return (
    <div className="rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-2 text-xs text-gray-400">data.json</div>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="text-green-400 font-mono">{formattedCode}</code>
      </pre>
    </div>
  );
}