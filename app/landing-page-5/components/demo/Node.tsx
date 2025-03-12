import React from "react";
import { motion } from "framer-motion";

export interface NodeProps {
  label: string;
  value?: any;
  x: number;
  y: number;
  delay: number;
  isObject?: boolean;
  isArray?: boolean;
  isExpanded?: boolean;
  onToggle: () => void;
}

// Node component for visualization
export const Node = ({
  label,
  value,
  x,
  y,
  delay,
  isObject = false,
  isArray = false,
  isExpanded = true,
  onToggle,
}: NodeProps) => {
  const color = isObject
    ? "bg-gradient-to-r from-sky-500 to-blue-600"
    : isArray
    ? "bg-gradient-to-r from-purple-500 to-indigo-600"
    : "bg-gradient-to-r from-emerald-500 to-teal-600";

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}px` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <motion.div
        className={`rounded-lg shadow-lg cursor-pointer ${
          isExpanded ? "mb-2" : "mb-0"
        }`}
        whileHover={{ scale: 1.05 }}
        onClick={onToggle}
      >
        <div
          className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${color}`}
        >
          {label}
          {(isObject || isArray) && (
            <span className="ml-2">{isExpanded ? "▼" : "►"}</span>
          )}
        </div>
      </motion.div>

      {value !== undefined && isExpanded && (
        <motion.div
          className="ml-6 px-3 py-1 bg-slate-800/50 backdrop-blur-sm rounded border border-white/10 text-white/80 text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {typeof value === "string" ? `"${value}"` : value.toString()}
        </motion.div>
      )}
    </motion.div>
  );
};