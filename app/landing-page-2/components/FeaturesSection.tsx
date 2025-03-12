"use client";

import { motion } from "framer-motion";
import { Network, Braces, Share2, Download, Sparkles, ExternalLink } from "lucide-react";

const features = [
  {
    icon: <Network className="h-6 w-6" />,
    title: "Interactive Flowcharts",
    description:
      "Visualize nested JSON structures as interactive, navigable flowcharts.",
  },
  {
    icon: <Braces className="h-6 w-6" />,
    title: "Syntax Highlighting",
    description:
      "Easily identify different data types with intuitive color coding.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Shareable Visualizations",
    description:
      "Export and share your visualizations with teammates.",
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Local Processing",
    description:
      "All data stays on your device - no server uploads required.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Smart Layout",
    description:
      "Automatic arrangement of nodes for optimal readability.",
  },
  {
    icon: <ExternalLink className="h-6 w-6" />,
    title: "Deep Linking",
    description:
      "Navigate directly to specific parts of your JSON structure.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-[#131c31] relative z-10">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#1a2234] p-6 rounded-xl border border-white/10 hover:border-violet-500/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center mb-4 group-hover:from-violet-600/30 group-hover:to-indigo-600/30 transition-all duration-300">
                <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}