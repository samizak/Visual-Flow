"use client";

import { useState, useEffect } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Sample JSON for the interactive demo
const sampleJson = `{
  "app": "JSONify",
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

interface HeroProps {
  scrollProgress: MotionValue<number>;
}

export default function Hero({ scrollProgress }: HeroProps) {
  const jsonOpacity = useTransform(scrollProgress, [0, 0.2], [1, 0.2]);
  const jsonScale = useTransform(scrollProgress, [0, 0.2], [1, 0.9]);
  const jsonY = useTransform(scrollProgress, [0, 0.2], [0, 50]);

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
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-8">
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
                Simplify complex JSON structures with interactive, intuitive
                visualizations that make data exploration effortless.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/app">
                <button className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white font-medium shadow-lg shadow-purple-500/20 transition-all duration-300 flex items-center">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
              <Link href="#demo">
                <button className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white font-medium transition-all duration-300">
                  View Demo
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="md:w-1/2 relative"
            style={{
              opacity: jsonOpacity,
              scale: jsonScale,
              y: jsonY,
            }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-purple-500 rounded-xl blur opacity-50"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-white/60 text-sm">data.json</span>
              </div>
              <pre className="font-mono text-sm text-emerald-400 overflow-x-auto">
                <code>{displayedJson}</code>
              </pre>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 bg-sky-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-white/50 text-sm mb-2">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-white/50 rounded-full"
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
