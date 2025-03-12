import React from "react";
import { FileJson, AlertCircle, FileX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DragOverlayProps {
  isVisible: boolean;
  error: string | null;
}

export default function DragOverlay({ isVisible, error }: DragOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          style={{
            backgroundColor: error
              ? "rgba(45, 10, 10, 0.95)"
              : "rgba(10, 22, 41, 0.95)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.1,
            ease: "easeOut",
          }}
        >
          <motion.div
            className={`p-8 rounded-xl border-2 shadow-2xl ${
              error
                ? "bg-[#3d1515] border-red-500"
                : "bg-[#1e293b] border-indigo-500"
            }`}
            initial={{ scale: 0.9, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.2,
            }}
          >
            {error ? (
              <div className="text-center flex flex-col items-center">
                <div className="mb-4 bg-red-500/20 p-3 rounded-full">
                  <FileX className="h-10 w-10 text-red-400" />
                </div>
                <p className="text-red-400 text-xl font-semibold mb-2">
                  Unsupported File Type
                </p>
                <p className="text-gray-300 text-base max-w-xs">{error}</p>
                <div className="mt-4 bg-red-500/10 rounded-lg px-4 py-2 text-sm text-gray-300">
                  <span className="text-red-400 font-medium">Tip:</span> Only
                  JSON files are supported
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center">
                <div className="mb-4 bg-indigo-500/20 p-3 rounded-full">
                  <FileJson className="h-10 w-10 text-indigo-400" />
                </div>
                <p className="text-white text-xl font-semibold mb-2">
                  Drop JSON File Here
                </p>
                <p className="text-gray-300 text-base max-w-xs">
                  Release to upload and visualize your JSON data
                </p>
                <div className="mt-4 bg-indigo-500/10 rounded-lg px-4 py-2 text-sm text-gray-300 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-indigo-400" />
                  Files will be processed locally, nothing is uploaded
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
