"use client";

import React from "react";
import { motion } from "motion/react";
import { 
  Network, 
  Zap, 
  Share2, 
  Lock, 
  FileJson, 
  Sparkles 
} from "lucide-react";
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
            Powerful Features for Developers
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Network className="h-6 w-6 text-indigo-400" />}
            title="Interactive Visualizations"
            description="Transform complex JSON structures into intuitive, interactive flowcharts that make data relationships clear at a glance."
            delay={0.1}
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-indigo-400" />}
            title="Real-time Processing"
            description="Instantly visualize your JSON data with our lightning-fast processing engine, even for large and complex structures."
            delay={0.2}
          />
          <FeatureCard
            icon={<Share2 className="h-6 w-6 text-indigo-400" />}
            title="Collaboration Tools"
            description="Share your visualizations with team members and collaborate in real-time with comments and annotations."
            delay={0.3}
          />
          <FeatureCard
            icon={<Lock className="h-6 w-6 text-indigo-400" />}
            title="Secure Data Handling"
            description="Your data never leaves your browser. We process everything client-side for maximum security and privacy."
            delay={0.4}
          />
          <FeatureCard
            icon={<FileJson className="h-6 w-6 text-indigo-400" />}
            title="Advanced Formatting"
            description="Automatically format and validate your JSON with intelligent indentation, syntax highlighting, and error detection."
            delay={0.5}
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-indigo-400" />}
            title="AI-Powered Insights"
            description="Get smart suggestions and insights about your data structure with our AI-powered analysis tools."
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
}
