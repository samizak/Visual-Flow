"use client";

import React from "react";
import { motion } from "framer-motion";

// Feature card component
export default function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
}