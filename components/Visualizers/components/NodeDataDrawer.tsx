import { Copy, X, FileJson, GitBranch, Code } from "lucide-react";
import { successToast, errorToast } from "../../../lib/toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerDescription,
} from "../../ui/drawer";
import Editor from "@monaco-editor/react";
import { Fragment, useState } from "react";
import { Button } from "../../ui/button";
import React from "react";

interface NodeDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  nodeLabel: string;
  // We'll need to add a new prop for the path data
  nodePath?: Array<{ id: string; label: string; data: any }>;
}

export default function NodeDataDrawer({
  isOpen,
  onClose,
  nodeData,
  nodeLabel,
  nodePath = [], // Default to empty array if not provided
}: NodeDataDrawerProps) {
  // Add state to toggle between JSON view and Path view
  const [viewMode, setViewMode] = useState<"json" | "path">("json");

  // Format the JSON data for display
  const formattedData = JSON.stringify(nodeData, null, 2);

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard
      .writeText(formattedData)
      .then(() => successToast("Node data copied to clipboard"))
      .catch(() => errorToast("Failed to copy node data"));
  };

  // Editor options
  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    readOnly: true,
    automaticLayout: true,
    fontSize: 14,
    lineNumbers: "on",
    renderIndentGuides: true,
    tabSize: 2,
    stickyScroll: { enabled: false },
    padding: {
      top: 10,
      bottom: 10,
    },
  };

  // Render the path visualization
  const renderPathView = () => {
    if (nodePath.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-[#1e1e2d] p-6">
          <GitBranch className="h-12 w-12 text-gray-500 mb-4" />
          <p className="text-gray-400 text-center">
            No path data available for this node.
          </p>
        </div>
      );
    }

    return (
      <div className="h-full bg-[#1e1e2d] p-4 overflow-auto">
        <div className="flex items-center space-x-2 overflow-x-auto pb-4">
          {nodePath.map((node, index) => (
            <Fragment key={node.id}>
              {/* Node card */}
              <div className="bg-[#2a2a3c] border border-indigo-500/30 rounded-md p-3 min-w-[180px]">
                <div className="text-indigo-400 font-medium text-sm mb-1 truncate">
                  {node.label}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {typeof node.data === "object"
                    ? `{${Object.keys(node.data).length} keys}`
                    : String(node.data)}
                </div>
              </div>

              {/* Connector (don't show for last item) */}
              {index < nodePath.length - 1 && (
                <div className="flex items-center justify-center">
                  <div className="text-indigo-500">→</div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[60vh] rounded-t-xl border-t border-indigo-500/30 bg-[#0f1117]">
        <div className="mx-auto w-[100px] h-1.5 bg-gray-600/40 rounded-full my-2" />
        <DrawerTitle className="sr-only">Node Data</DrawerTitle>
        <div className="mx-auto w-full max-w-4xl">
          <div className="p-4 pb-0">
            <div className="rounded-t-md overflow-hidden border border-gray-800/50 border-b-0">
              <DrawerHeader className="flex flex-row items-center justify-between py-3 px-4 bg-[#161923] m-0">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-500/10 p-2 rounded-md">
                    <FileJson size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <DrawerTitle className="text-left text-lg font-medium text-white">
                      {nodeLabel}
                    </DrawerTitle>
                    <DrawerDescription className="text-xs text-indigo-300/70 mt-0.5">
                      {viewMode === "json"
                        ? "JSON node data"
                        : "Node path visualization"}
                    </DrawerDescription>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* View toggle buttons with sliding animation */}
                  <div className="flex bg-gray-800/50 rounded-md p-0.5 mr-2 relative">
                    {/* Sliding background */}
                    <div 
                      className={`absolute top-0.5 bottom-0.5 rounded transition-all duration-200 ease-in-out bg-indigo-600 z-0 ${
                        viewMode === "json" 
                          ? "left-0.5 right-[calc(50%+0.5px)]" 
                          : "left-[calc(50%+0.5px)] right-0.5"
                      }`}
                    />
                    
                    {/* JSON Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`px-2 py-1 h-8 z-10 relative transition-colors duration-200 ${
                        viewMode === "json"
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }`}
                      onClick={() => setViewMode("json")}
                      title="View JSON Data"
                    >
                      <Code size={14} className="mr-1" />
                      JSON
                    </Button>
                    
                    {/* Path Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`px-2 py-1 h-8 z-10 relative transition-colors duration-200 ${
                        viewMode === "path"
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }`}
                      onClick={() => setViewMode("path")}
                      title="View Node Path"
                    >
                      <GitBranch size={14} className="mr-1" />
                      Path
                    </Button>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors text-white shadow-sm cursor-pointer"
                    title="Copy JSON"
                  >
                    <Copy size={16} />
                  </button>
                  <DrawerClose
                    className="p-2 rounded-md bg-gray-700/70 hover:bg-gray-600 transition-colors text-white shadow-sm cursor-pointer"
                    title="Close"
                  >
                    <X size={16} />
                  </DrawerClose>
                </div>
              </DrawerHeader>
              <div className="h-[40vh]">
                {viewMode === "json" ? (
                  <Editor
                    height="100%"
                    language="json"
                    value={formattedData}
                    options={editorOptions as any}
                    theme="vs-dark"
                  />
                ) : (
                  renderPathView()
                )}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
