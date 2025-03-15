import { useState, useEffect } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface JsonErrorMessageProps {
  isVisible: boolean;
}

export default function JsonErrorMessage({ isVisible }: JsonErrorMessageProps) {
  const [isErrorCollapsed, setIsErrorCollapsed] = useState(false);
  const [prevIsVisible, setPrevIsVisible] = useState(false);

  // Reset collapsed state when visibility changes from false to true
  useEffect(() => {
    if (isVisible && !prevIsVisible) {
      setIsErrorCollapsed(false);
    }
    setPrevIsVisible(isVisible);
  }, [isVisible, prevIsVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="border-b border-red-800"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <button
            onClick={() => setIsErrorCollapsed(!isErrorCollapsed)}
            className="w-full bg-red-900/90 px-4 py-2 flex items-center justify-between text-white hover:bg-red-900/70 transition-colors"
          >
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-red-300" />
              <span className="font-semibold">Invalid JSON</span>
            </div>
            {isErrorCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <motion.div
            className="bg-red-900/90 overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: isErrorCollapsed ? 0 : "auto" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-4 py-3">
              <p className="text-sm text-red-200">
                Please check your syntax. Common issues include missing commas,
                unmatched brackets, or trailing commas.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
