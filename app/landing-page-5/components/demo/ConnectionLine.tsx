import React, { useRef } from "react";
import { motion } from "framer-motion";

export interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}

// Connection line component
export const ConnectionLine = ({ startX, startY, endX, endY, delay }: ConnectionLineProps) => {
  const pathRef = useRef(null);

  return (
    <motion.svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.path
        ref={pathRef}
        d={`M ${startX}% ${startY} C ${startX}% ${
          (startY + endY) / 2
        }, ${endX}% ${(startY + endY) / 2}, ${endX}% ${endY}`}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};