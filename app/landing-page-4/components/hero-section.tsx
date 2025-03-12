"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Scene } from "./scene";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Visualize JSON in{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">
                  Beautiful 3D Space
                </span>
              </h1>
              <p className="mt-6 text-xl text-slate-300 leading-relaxed">
                Transform complex JSON structures into intuitive, interactive 3D
                visualizations that make data exploration effortless.
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
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 h-12 px-8"
                >
                  Start Visualizing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-white hover:bg-slate-800 h-12 px-8"
                >
                  See Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                "No account required",
                "Your data never leaves your browser",
                "Open source and free to use",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="lg:w-1/2 h-[400px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur opacity-30"></div>
              <div className="relative h-full w-full rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/50">
                <Scene />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="text-slate-400 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
