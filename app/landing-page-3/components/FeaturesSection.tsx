"use client";

import React from "react";
import { motion } from "motion/react";
import { Terminal, Layers, Cpu, MousePointerClick } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Everything you need to understand and work with complex JSON data
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Terminal className="h-6 w-6 text-indigo-400" />}
            title="Smart Parsing"
            description="Automatically parse and validate JSON data with intelligent error handling and suggestions."
            delay={0.1}
          />
          <FeatureCard
            icon={<Layers className="h-6 w-6 text-indigo-400" />}
            title="3D Visualization"
            description="Transform your JSON into interactive 3D models that reveal structure and relationships."
            delay={0.2}
          />
          <FeatureCard
            icon={<Cpu className="h-6 w-6 text-indigo-400" />}
            title="Schema Detection"
            description="Automatically detect and generate JSON schemas from your data samples."
            delay={0.3}
          />
          <FeatureCard
            icon={<MousePointerClick className="h-6 w-6 text-indigo-400" />}
            title="Interactive Editing"
            description="Edit your JSON with real-time visual feedback and intelligent suggestions."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
