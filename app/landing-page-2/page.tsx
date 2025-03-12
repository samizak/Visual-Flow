"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import {
  FileJson,
  ChevronRight,
  Braces,
  Network,
  Share2,
  Download,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { cn } from "../../lib/utils";

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

export default function LandingPageAlternative() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(demoRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll();

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

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Floating elements background */}
      <div className="fixed inset-0 z-0 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(50px)",
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-70"></div>
              <div className="relative bg-[#0f172a] p-2 rounded-full">
                <FileJson className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Visual Flow
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-white/70 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-white/70 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-white/70 hover:text-white transition-colors"
            >
              Testimonials
            </Link>
          </div>

          <Link href="/app">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0">
              Try It Now
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-32 pb-20 md:pt-40 md:pb-32 relative z-10"
      >
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#131c31] relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Powerful Features for Developers
            </motion.h2>
            <motion.p
              className="text-xl text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Everything you need to understand and work with complex JSON data
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Network className="h-6 w-6" />,
                title: "Interactive Flowcharts",
                description:
                  "Visualize nested JSON structures as interactive, navigable flowcharts.",
              },
              {
                icon: <Braces className="h-6 w-6" />,
                title: "Syntax Highlighting",
                description:
                  "Easily identify different data types with intuitive color coding.",
              },
              {
                icon: <Share2 className="h-6 w-6" />,
                title: "Shareable Visualizations",
                description:
                  "Export and share your visualizations with teammates.",
              },
              {
                icon: <Download className="h-6 w-6" />,
                title: "Local Processing",
                description:
                  "All data stays on your device - no server uploads required.",
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "Smart Layout",
                description:
                  "Automatic arrangement of nodes for optimal readability.",
              },
              {
                icon: <ExternalLink className="h-6 w-6" />,
                title: "Deep Linking",
                description:
                  "Navigate directly to specific parts of your JSON structure.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#1a2234] p-6 rounded-xl border border-white/10 hover:border-violet-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600/20 to-indigo-600/20 flex items-center justify-center mb-4 group-hover:from-violet-600/30 group-hover:to-indigo-600/30 transition-all duration-300">
                  <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#131c31] relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How Visual Flow Works
            </motion.h2>
            <motion.p
              className="text-xl text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Three simple steps to transform your JSON data
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 transform -translate-y-1/2 z-0"></div>

            {[
              {
                step: "01",
                title: "Upload or Paste JSON",
                description:
                  "Drag & drop your JSON file or paste your JSON data directly into the editor.",
              },
              {
                step: "02",
                title: "Automatic Processing",
                description:
                  "Our engine analyzes your JSON structure and creates an optimized visualization layout.",
              },
              {
                step: "03",
                title: "Explore & Interact",
                description:
                  "Navigate through your data visually, expand nodes, and discover relationships.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative z-10 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-full bg-[#0f172a] border-2 border-indigo-500 flex items-center justify-center mb-6 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-sm opacity-70 animate-pulse"></div>
                  <div className="relative text-xl font-bold text-white">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What Developers Say
            </motion.h2>
            <motion.p
              className="text-xl text-white/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of satisfied developers using JSONify
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "JSONify has completely changed how I work with API responses. The visualizations make it so much easier to understand complex data structures.",
                author: "Alex Chen",
                role: "Frontend Developer",
                avatar: "AC",
              },
              {
                quote:
                  "I use this tool daily for debugging our backend services. Being able to visualize the JSON responses has cut my debugging time in half.",
                author: "Sarah Johnson",
                role: "Backend Engineer",
                avatar: "SJ",
              },
              {
                quote:
                  "As someone who works with complex nested JSON data, this tool is a lifesaver. The interactive flowcharts make it easy to navigate through the structure.",
                author: "Michael Rodriguez",
                role: "Data Scientist",
                avatar: "MR",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-[#1a2234] p-6 rounded-xl border border-white/10 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-3 -left-3 text-4xl text-indigo-500 opacity-50">
                  &quot;
                </div>
                <p className="text-white/80 mb-6 relative z-10">
                  {testimonial.quote}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Visualize Your JSON Data?
                </h2>
                <p className="text-xl text-white/70">
                  Start transforming complex JSON structures into beautiful,
                  interactive visualizations today.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center md:justify-end">
                <Link href="/app">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 h-14 px-8 text-lg"
                  >
                    Get Started Free
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0a0f1a] border-t border-white/10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-70"></div>
                  <div className="relative bg-[#0f172a] p-2 rounded-full">
                    <FileJson className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Visual Flow
                </span>
              </div>
              <p className="text-white/60 max-w-md">
                Transform complex JSON data into beautiful, interactive
                visualizations that make data exploration effortless.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#demo"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Visual Flow. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-white/60 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-white/60 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
