"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BackgroundElements() {
  // Use state to store the elements configuration
  const [elements, setElements] = useState<Array<{
    width: number;
    height: number;
    left: string;
    top: string;
    xMovement: number;
    yMovement: number;
    duration: number;
  }>>([]);

  // Generate elements only on the client side
  useEffect(() => {
    const generatedElements = Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      xMovement: Math.random() * 100 - 50,
      yMovement: Math.random() * 100 - 50,
      duration: Math.random() * 10 + 10,
    }));
    
    setElements(generatedElements);
  }, []);

  return (
    <div className="fixed inset-0 z-0 opacity-20">
      {elements.map((element, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-500"
          style={{
            width: element.width,
            height: element.height,
            left: element.left,
            top: element.top,
            filter: "blur(50px)",
          }}
          animate={{
            x: [0, element.xMovement],
            y: [0, element.yMovement],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}