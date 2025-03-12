"use client";

import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import DemoSection from "./components/DemoSection";
import FeaturesSection from "./components/FeaturesSection";
import WorkflowSection from "./components/WorkflowSection";
import PricingSection from "./components/PricingSection";
import Scene from "./components/Scene";

// Sample JSON for the interactive demo
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

export default function LandingPageThree() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-purple-900/20 to-transparent"></div>
      </div>

      <Header />
      <HeroSection LocalScene={Scene} />
      <FeaturesSection />
      <DemoSection LocalScene={Scene} sampleJson={sampleJson} />
      <WorkflowSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
