"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Scene } from "./scene";
import { Share2, ClipboardCopy } from "lucide-react";

export function DemoSection() {
  const [activeTab, setActiveTab] = useState("visualize");

  const sampleJson = {
    app: "Visual Flow",
    version: "2.0",
    features: ["3D Visualization", "Real-time Parsing", "Schema Detection"],
    settings: {
      theme: "dark",
      autoSave: true,
      notifications: {
        enabled: true,
        frequency: "daily",
      },
    },
  };

  const formattedJson = JSON.stringify(sampleJson, null, 2);

  return (
    <section id="demo" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See Visual Flow in Action
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Transform your JSON data into interactive visualizations
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs
            defaultValue="visualize"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="visualize">Visualize</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="share">Share</TabsTrigger>
            </TabsList>

            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-8">
              <TabsContent value="visualize" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Interactive 3D Visualization
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Visual Flow transforms your JSON data into an interactive
                      3D model that you can rotate, zoom, and explore from any
                      angle. Discover relationships and hierarchies in your data
                      like never before.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Intuitive node-based visualization
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Interactive 3D navigation
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Color-coded data types
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative aspect-square">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur opacity-30"></div>
                    <div className="relative h-full w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                      <Scene />
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
                    <p className="text-slate-400 mb-6">
                      Visual Flow automatically analyzes your JSON structure to
                      identify patterns, detect schemas, and highlight potential
                      issues or optimizations.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Automatic schema detection
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Data validation and error detection
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Performance optimization suggestions
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-slate-400 text-sm">
                          data.json
                        </span>
                      </div>
                      <pre className="font-mono text-sm text-green-400 overflow-x-auto">
                        <code>{formattedJson}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="share" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Easy Sharing & Collaboration
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Share your visualizations with teammates or clients with a
                      simple link. No account required, and your data stays
                      private.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Generate shareable links
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Export as interactive HTML
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        </div>
                        <span className="text-slate-400">
                          Privacy-first sharing options
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="w-full max-w-md p-8 rounded-xl bg-slate-900 border border-slate-700">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <Share2 className="h-8 w-8 text-indigo-400" />
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold text-center mb-2">
                        Share Your Visualization
                      </h4>
                      <p className="text-slate-400 text-center mb-6">
                        Generate a link to share your visualization with anyone
                      </p>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 border border-slate-700 mb-4">
                        <span className="text-slate-400 truncate text-sm">
                          https://visualflow.app/share/example-visualization
                        </span>{" "}
                        <span className="text-slate-400 truncate text-sm">
                          https://visualflow.app/share/example-visualization
                        </span>
                        <button className="ml-auto bg-indigo-500 hover:bg-indigo-600 text-white rounded p-1">
                          <ClipboardCopy className="h-4 w-4" />
                        </button>
                      </div>
                      <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2 px-4 transition-colors">
                        Generate Shareable Link
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
