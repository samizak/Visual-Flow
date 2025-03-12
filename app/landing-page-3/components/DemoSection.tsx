"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import CodeEditor from "./CodeEditor";

interface DemoSectionProps {
  LocalScene: React.ComponentType;
  sampleJson: any;
}

export default function DemoSection({
  LocalScene,
  sampleJson,
}: DemoSectionProps) {
  const [activeTab, setActiveTab] = useState("visualize");

  return (
    <section id="demo" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            See Visual Flow in Action
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Transform your JSON data into interactive visualizations
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs
            defaultValue="visualize"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="visualize">Visualize</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="share">Share</TabsTrigger>
            </TabsList>

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="visualize" className="mt-0">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          Interactive 3D Visualization
                        </h3>
                        <p className="text-white/70 mb-6">
                          Visual Flow transforms your JSON data into an
                          interactive 3D model that you can rotate, zoom, and
                          explore from any angle. Discover relationships and
                          hierarchies in your data like never before.
                        </p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Intuitive node-based visualization
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Interactive 3D navigation
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Color-coded data types
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
                        <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black">
                          <div className="h-full w-full">
                            <LocalScene />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analyze" className="mt-0">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          Intelligent Analysis
                        </h3>
                        <p className="text-white/70 mb-6">
                          Visual Flow automatically analyzes your JSON structure
                          to identify patterns, detect schemas, and highlight
                          potential issues or optimizations.
                        </p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Schema detection and validation
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Data type analysis
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Structure optimization suggestions
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <CodeEditor code={sampleJson} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="share" className="mt-0">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          Seamless Sharing
                        </h3>
                        <p className="text-white/70 mb-6">
                          Export your visualizations in multiple formats or
                          generate shareable links to collaborate with your team
                          without sharing the raw data.
                        </p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Export as PNG, SVG, or interactive HTML
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Generate shareable links
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            </div>
                            <span className="text-white/70">
                              Embed in documentation or websites
                            </span>
                          </li>
                        </ul>
                        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0">
                          Try Sharing Features
                        </Button>
                      </div>
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
                        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                              <span className="text-white/40">PNG Export</span>
                            </div>
                            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                              <span className="text-white/40">SVG Export</span>
                            </div>
                            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                              <span className="text-white/40">HTML Export</span>
                            </div>
                            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                              <span className="text-white/40">Share Link</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
