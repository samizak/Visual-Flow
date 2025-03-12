import React from "react";
import { motion } from "framer-motion";

interface CodePanelProps {
  data: any;
}

export const CodePanel = ({ data }: CodePanelProps) => {
  return (
    <motion.div
      className="bg-slate-800/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg lg:w-1/3 h-[600px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-white/60 text-sm">data.json</span>
      </div>
      <div className="overflow-auto flex-grow p-4">
        <pre className="text-sm text-emerald-400">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
      <div className="p-4 border-t border-white/10 bg-slate-800/50">
        <p className="text-white/70 text-sm">
          This JSON data is visualized in the interactive diagram on the left.
          Try expanding and collapsing nodes to explore the structure.
        </p>
      </div>
    </motion.div>
  );
};