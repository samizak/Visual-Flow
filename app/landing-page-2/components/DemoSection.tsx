"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "../../../components/ui/button";

export default function DemoSection() {
  const demoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(demoRef, { once: true, amount: 0.3 });

  return (
    <section id="demo" ref={demoRef} className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            See Visual Flow in Action
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Transform raw JSON into beautiful, interactive visualizations
          </motion.p>
        </div>

        <motion.div
          className="relative rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 z-0"></div>
          <div className="relative z-10 aspect-video bg-[#1a2234] border border-white/10 rounded-xl overflow-hidden">
            {/* Replace with actual demo video or interactive component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/70 mb-4">Watch the demo video</p>
                <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white">
                  Play Demo
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
