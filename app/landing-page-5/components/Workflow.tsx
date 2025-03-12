"use client";

import { motion } from "framer-motion";
import { Upload, Code, Eye, Share2 } from "lucide-react";

const steps = [
  {
    icon: <Upload className="h-6 w-6" />,
    title: "Upload JSON",
    description: "Paste your JSON data or upload a file to get started.",
    color: "from-sky-500 to-blue-600",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Auto-Format",
    description: "Your JSON is automatically formatted and validated.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Visualize",
    description: "See your data transformed into an interactive visualization.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Share & Export",
    description: "Share your visualization or export it for presentations.",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Transform your JSON data in just a few simple steps
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-white/5 z-0">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-500 to-purple-500"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    viewport={{ once: true }}
                  />
                </div>
              )}

              <div className="bg-slate-800/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-slate-800/90 transition-all duration-300 h-full shadow-lg">
                <div className="mb-4 relative inline-block">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full blur-md opacity-90`}
                  ></div>
                  <div className="relative bg-slate-800 p-3 rounded-full border border-white/10">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{step.title}</h3>
                <p className="text-white/80">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
