"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowRight, Lock, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/button";

// Sample JSON for the interactive demo
const sampleJson = `{
  "app": "Visual Flow",
  "version": "2.0",
  "features": [
    "Interactive Visualizations",
    "Real-time Collaboration",
    "Smart Formatting"
  ],
  "stats": {
    "users": 12500,
    "rating": 4.9,
    "downloads": 50000
  }
}`;

interface HeroSectionProps {
  LocalScene: React.ComponentType;
}

export default function HeroSection({ LocalScene }: HeroSectionProps) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Typing animation for the JSON code
  const [displayedJson, setDisplayedJson] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < sampleJson.length) {
      const timeout = setTimeout(() => {
        setDisplayedJson((prev) => prev + sampleJson[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 15);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <section
      ref={heroRef}
      className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Transform JSON into
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500">
                  Beautiful Visualizations
                </span>
              </h1>
              <p className="mt-6 text-xl text-white/70 leading-relaxed">
                Transform complex JSON structures into beautiful, interactive 3D
                visualizations that bring your data to life.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 h-12 px-8"
                >
                  Start Visualizing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 h-12 px-8"
                >
                  See Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-sm text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Lock className="h-4 w-4" />
              <span>
                No account required. Your data never leaves your browser.
              </span>
            </motion.div>
          </div>

          <motion.div
            className="lg:w-1/2 h-[400px] relative"
            style={{ opacity, scale }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-full max-w-md bg-slate-800/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-white/60 text-sm">data.json</span>
                </div>
                <div className="p-4 font-mono text-sm">
                  <pre className="text-emerald-400 whitespace-pre-wrap">
                    {displayedJson}
                  </pre>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="h-6 w-6 text-white/60 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
