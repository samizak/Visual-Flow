"use client";

import { useState, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

// Sample JSON for the interactive demo
const sampleJson = `{
  "name": "Visual Flow",
  "version": "1.0.0",
  "features": [
    "Interactive Flowcharts",
    "Real-time Processing",
    "Drag & Drop Interface"
  ],
  "stats": {
    "users": 5000,
    "avgRating": 4.8
  }
}`;

interface HeroSectionProps {
  scrollYProgress: any;
}

export default function HeroSection({ scrollYProgress }: HeroSectionProps) {
  const jsonOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  const jsonScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Typing animation for the JSON code
  const [displayedJson, setDisplayedJson] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < sampleJson.length) {
      const timeout = setTimeout(() => {
        setDisplayedJson((prev) => prev + sampleJson[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20);

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
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Visualize JSON Data with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">
                  Clarity
                </span>
              </h1>
              <p className="mt-6 text-xl text-white/70 leading-relaxed">
                Transform complex JSON structures into intuitive, interactive
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
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 h-12 px-8"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 h-12 px-8"
                >
                  View Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 text-sm text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-[#0f172a]"
                  />
                ))}
              </div>
              <span>Trusted by 5,000+ developers</span>
            </motion.div>
          </div>

          <motion.div
            className="md:w-1/2 relative"
            style={{ opacity: jsonOpacity, scale: jsonScale }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur opacity-50"></div>
            <div className="relative bg-[#1a2234] p-6 rounded-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-white/60 text-sm">
                  json-data.json
                </span>
              </div>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
                <code>{displayedJson}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}