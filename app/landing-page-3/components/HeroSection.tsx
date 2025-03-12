"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface HeroSectionProps {
  LocalScene: React.ComponentType;
}

export default function HeroSection({ LocalScene }: HeroSectionProps) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

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
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Visualize JSON in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  3D Space
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

          <motion.div className="lg:w-1/2 h-[400px]" style={{ opacity, scale }}>
            <LocalScene />
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
