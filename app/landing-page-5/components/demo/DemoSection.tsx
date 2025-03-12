"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { VisualizationPanel } from "./VisualizationPanel";
import { CodePanel } from "./CodePanel";
import { sampleJsonData } from "./sampleData";

export default function DemoSection() {
  const [expandedNodes, setExpandedNodes] = useState({
    root: true, // Add the root node to the state
    company: true,
    founded: true,
    location: true,
    "location.city": true,
    "location.country": true,
    "location.coordinates": true,
    "location.coordinates.lat": true,
    "location.coordinates.lng": true,
    employees: true,
    "employees.0": true,
    "employees.0.id": true,
    "employees.0.name": true,
    "employees.0.role": true,
    "employees.0.skills": true,
    "employees.1": false,
    products: false,
    active: true,
  });

  const toggleNode = (nodePath: string) => {
    if (nodePath === "expandAll") {
      // Expand all nodes
      const allExpanded: Record<string, boolean> = {};
      Object.keys(expandedNodes).forEach((key) => {
        allExpanded[key] = true;
      });
      setExpandedNodes(allExpanded as typeof expandedNodes);
      return;
    }

    if (nodePath === "collapseAll") {
      // Collapse all nodes
      const allCollapsed: Record<string, boolean> = {};
      Object.keys(expandedNodes).forEach((key) => {
        allCollapsed[key] = false;
      });
      // Keep root expanded
      allCollapsed["root"] = true;
      setExpandedNodes(allCollapsed as typeof expandedNodes);
      return;
    }

    // Toggle individual node
    setExpandedNodes((prev) => ({
      ...prev,
      [nodePath]: !prev[nodePath as keyof typeof prev],
    }));
  };

  return (
    <section id="demo" className="py-20 bg-slate-950/50 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              See It In Action
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Interactive visualization of complex JSON structures
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Visualization panel */}
          <VisualizationPanel
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
          />

          {/* Code snippet panel */}
          <CodePanel data={sampleJsonData} />
        </div>
      </div>
    </section>
  );
}
