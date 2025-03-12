"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const [elements, setElements] = useState<Array<{
    id: number;
    size: number;
    x: string;
    y: string;
    duration: number;
    delay: number;
    color: string;
  }>>([]);

  useEffect(() => {
    // Modern gradient colors
    const colors = [
      "rgba(99, 102, 241, 0.15)",  // Indigo
      "rgba(139, 92, 246, 0.15)",  // Purple
      "rgba(236, 72, 153, 0.15)",  // Pink
      "rgba(14, 165, 233, 0.15)",  // Sky
      "rgba(20, 184, 166, 0.15)",  // Teal
    ];

    // Generate random elements
    const newElements = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * 300 + 100,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full"
          style={{
            width: el.size,
            height: el.size,
            left: el.x,
            top: el.y,
            background: el.color,
            filter: "blur(80px)",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
            x: [0, 30, 0, -30, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}