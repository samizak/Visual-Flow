"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, FileJson, Code, Eye, Zap, Github } from "lucide-react";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileJson className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-bold">Visual Flow</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/yourusername/json-visualiser"
            target="_blank"
          >
            <Button variant="ghost" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </Link>
          <Link href="/app">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Launch App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Transform JSON into Beautiful Visualizations
          </h1>
          <p className="text-xl text-gray-300 mb-10">
            Instantly convert complex JSON data into intuitive, interactive
            flowcharts that make your data easy to understand and navigate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Start Visualizing
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                See Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Powerful Features
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Eye className="h-10 w-10 text-indigo-400" />,
                title: "Interactive Visualization",
                description:
                  "Navigate through complex JSON structures with intuitive, interactive flowcharts.",
              },
              {
                icon: <Zap className="h-10 w-10 text-purple-400" />,
                title: "Instant Processing",
                description:
                  "Process and visualize your JSON data in real-time with zero server uploads.",
              },
              {
                icon: <Code className="h-10 w-10 text-pink-400" />,
                title: "Developer Friendly",
                description:
                  "Designed for developers, with support for large JSON files and complex structures.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="bg-gray-900 rounded-lg p-4 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              See It In Action
            </span>
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-10">
            Watch how Visual Flow transforms complex JSON data into clear,
            navigable visualizations.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-video relative">
              {/* Replace with actual demo video or screenshot */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                <p className="text-gray-400">
                  Demo visualization will appear here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to visualize your data?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Start transforming your JSON data into beautiful, interactive
            visualizations today.
          </p>
          <Link href="/app">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6"
            >
              Launch Visual Flow
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <FileJson className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold">Visual Flow</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Visual Flow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
