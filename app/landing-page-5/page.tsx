"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import Hero from "./components/Hero";
import Features from "./components/Features";
import DemoSection from "./components/DemoSection";
import Workflow from "./components/Workflow";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Cta from "./components/Cta";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Navbar */}
      <Navbar />

      {/* Hero section */}
      <Hero scrollProgress={scrollYProgress} />

      {/* Features section */}
      <Features />

      {/* Interactive demo section */}
      <DemoSection />

      {/* Workflow section */}
      <Workflow />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <Pricing />

      {/* Call to action */}
      <Cta />

      {/* Footer */}
      <Footer />
    </div>
  );
}
