"use client";

import React from "react";
import Header from "./landing-page/components/Header";
import Footer from "./landing-page/components/Footer";
import HeroSection from "./landing-page/components/HeroSection";
import DemoSection from "./landing-page/components/DemoSection";
import FeaturesSection from "./landing-page/components/FeaturesSection";
import WorkflowSection from "./landing-page/components/WorkflowSection";
import PricingSection from "./landing-page/components/PricingSection";
import CtaSection from "./landing-page/components/CtaSection";
import Scene from "./landing-page/components/Scene";

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
      <CtaSection />
      <Footer />
    </div>
  );
}
