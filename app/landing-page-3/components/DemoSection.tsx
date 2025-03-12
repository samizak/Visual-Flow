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
import ImagePopup from "./ImagePopup";

interface DemoSectionProps {
  LocalScene: React.ComponentType;
  sampleJson: any;
}

export default function DemoSection({
  LocalScene,
  sampleJson,
}: DemoSectionProps) {
  const [activeTab, setActiveTab] = useState("visualize");
  const [showImagePopup, setShowImagePopup] = useState(false);

  // Disable scrolling when popup is open
  React.useEffect(() => {
    if (showImagePopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showImagePopup]);

  return (
    <section id="demo" className="py-12 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            See Visual Flow in Action
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Transform your JSON data into interactive visualizations
          </motion.p>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <Tabs
            defaultValue="visualize"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 mb-6 md:mb-8 w-full max-w-md mx-auto bg-black/30 p-1 rounded-full border border-white/10 backdrop-blur-sm relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-white/5">
              <div
                className="absolute h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-cyan-500/20"
                style={{
                  width: "33.333%",
                  transform: `translateX(${
                    activeTab === "visualize"
                      ? "0%"
                      : activeTab === "analyze"
                      ? "100%"
                      : "200%"
                  })`,
                }}
              />
              <TabsTrigger
                value="visualize"
                className="rounded-full px-4 py-2 z-10 transition-all duration-200 text-white/90 data-[state=active]:text-white data-[state=active]:font-medium hover:text-cyan-200 flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span className="relative flex items-center justify-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 transition-transform group-hover:scale-110 text-cyan-300 group-data-[state=active]:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    />
                  </svg>
                  <span>Visualize</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="analyze"
                className="rounded-full px-4 py-2 z-10 transition-all duration-200 text-white/90 data-[state=active]:text-white data-[state=active]:font-medium hover:text-cyan-200 flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span className="relative flex items-center justify-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 transition-transform group-hover:scale-110 text-cyan-300 group-data-[state=active]:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Analyze</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="share"
                className="rounded-full px-4 py-2 z-10 transition-all duration-200 text-white/90 data-[state=active]:text-white data-[state=active]:font-medium hover:text-cyan-200 flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span className="relative flex items-center justify-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 transition-transform group-hover:scale-110 text-cyan-300 group-data-[state=active]:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>Share</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm p-4 sm:p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="visualize" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start md:items-center">
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
                          <div 
                            className="h-full w-full overflow-hidden cursor-pointer group"
                            onClick={() => setShowImagePopup(true)}
                          >
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                            <img
                              src="/demo.jpg"
                              alt="JSON Visualization Demo"
                              className="w-full h-full object-cover object-[-10px_center] transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
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

      {/* Replace the existing Image Popup Overlay with this: */}
      <ImagePopup 
        isOpen={showImagePopup}
        onClose={() => setShowImagePopup(false)}
        imageSrc="/demo.jpg"
        imageAlt="JSON Visualization Demo Full View"
      />
    </section>
  );
}
