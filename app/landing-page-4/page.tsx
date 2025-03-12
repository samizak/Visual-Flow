"use client";

import React from "react";
import { Navbar } from "./components/navbar";
import { HeroSection } from "./components/hero-section";
import { FeaturesSection } from "./components/features-section";
import { DemoSection } from "./components/demo-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { PricingSection } from "./components/pricing-section";
import { CtaSection } from "./components/cta-section";
import { Footer } from "./components/footer";

export default function LandingPageFour() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] pointer-events-none"></div>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
