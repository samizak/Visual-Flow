import { Copy, X, FileJson } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerDescription,
} from "../../ui/drawer";
import Editor from "@monaco-editor/react";

interface NodeDataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  nodeLabel: string;
}

export default function NodeDataDrawer({
  isOpen,
  onClose,
  nodeData,
  nodeLabel,
}: NodeDataDrawerProps) {
  // Format the JSON data for display
  const formattedData = JSON.stringify(nodeData, null, 2);

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard
      .writeText(formattedData)
      .then(() => toast.success("Node data copied to clipboard"))
      .catch(() => toast.error("Failed to copy node data"));
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
                      JSON node data
                    </DrawerDescription>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors text-white shadow-sm"
                    title="Copy JSON"
                  >
                    <Copy size={16} />
                  </button>
                  <DrawerClose
                    className="p-2 rounded-md bg-gray-700/70 hover:bg-gray-600 transition-colors text-white shadow-sm"
                    title="Close"
                  >
                    <X size={16} />
                  </DrawerClose>
                </div>
              </DrawerHeader>
              <div className="h-[40vh]">
                <Editor
                  height="100%"
                  language="json"
                  value={formattedData}
                  options={editorOptions as any}
                  theme="vs-dark"
                />
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
