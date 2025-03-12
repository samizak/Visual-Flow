"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Upload or Paste JSON",
    description:
      "Drag & drop your JSON file or paste your JSON data directly into the editor.",
  },
  {
    step: "02",
    title: "Automatic Processing",
    description:
      "Our engine analyzes your JSON structure and creates an optimized visualization layout.",
  },
  {
    step: "03",
    title: "Explore & Interact",
    description:
      "Navigate through your data visually, expand nodes, and discover relationships.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-[#131c31] relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How Visual Flow Works
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Three simple steps to transform your JSON data
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 transform -translate-y-1/2 z-0"></div>

          {steps.map((item, index) => (
            <motion.div
              key={index}
              className="relative z-10 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-full bg-[#0f172a] border-2 border-indigo-500 flex items-center justify-center mb-6 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-sm opacity-70 animate-pulse"></div>
                <div className="relative text-xl font-bold text-white">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-white/70">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}