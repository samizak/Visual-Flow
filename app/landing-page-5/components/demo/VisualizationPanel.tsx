import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Node } from "./Node";
import { ConnectionLine } from "./ConnectionLine";
import { sampleJsonData } from "./sampleData";

interface VisualizationPanelProps {
  expandedNodes: Record<string, boolean>;
  toggleNode: (nodePath: string) => void;
}

export const VisualizationPanel = ({ expandedNodes, toggleNode }: VisualizationPanelProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="relative bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-xl p-6 h-[600px] overflow-hidden shadow-lg lg:w-2/3"
    >
      {isInView && (
        <>
          {/* Root node */}
          <Node
            label="Root Object"
            x={10}
            y={50}
            delay={0.2}
            isObject={true}
            isExpanded={expandedNodes["root"]}
            onToggle={() => toggleNode("root")}
          />

          {/* Company */}
          <Node
            label="company"
            value={sampleJsonData.company}
            x={25}
            y={120}
            delay={0.4}
            isExpanded={expandedNodes["company"]}
            onToggle={() => toggleNode("company")}
          />
          <ConnectionLine
            startX={10}
            startY={65}
            endX={25}
            endY={130}
            delay={0.3}
          />

          {/* Founded */}
          <Node
            label="founded"
            value={sampleJsonData.founded}
            x={25}
            y={180}
            delay={0.5}
            isExpanded={expandedNodes["founded"]}
            onToggle={() => toggleNode("founded")}
          />
          <ConnectionLine
            startX={10}
            startY={65}
            endX={25}
            endY={190}
            delay={0.4}
          />

          {/* Location */}
          <Node
            label="location"
            x={25}
            y={240}
            delay={0.6}
            isObject={true}
            isExpanded={expandedNodes["location"]}
            onToggle={() => toggleNode("location")}
          />
          <ConnectionLine
            startX={10}
            startY={65}
            endX={25}
            endY={250}
            delay={0.5}
          />

          {/* Add more nodes as needed */}
          {/* This is where you would add the rest of your nodes */}
        </>
      )}

      {/* Interactive controls */}
      <div className="absolute bottom-4 right-4 flex gap-3">
        <motion.button
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-white text-sm hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Expand all nodes
            const allExpanded: Record<string, boolean> = {};
            Object.keys(expandedNodes).forEach((key) => {
              allExpanded[key] = true;
            });
            toggleNode("expandAll");
          }}
        >
          Expand All
        </motion.button>
        <motion.button
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-white text-sm hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Collapse all nodes
            toggleNode("collapseAll");
          }}
        >
          Collapse All
        </motion.button>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-60 h-60 bg-sky-500/10 rounded-full blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
      />
    </div>
  );
};