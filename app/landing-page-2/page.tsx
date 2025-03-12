"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";

// Import components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import DemoSection from "./components/DemoSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import BackgroundElements from "./components/BackgroundElements";

export default function LandingPageAlternative() {
  // Setup scroll progress for animations
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Background elements */}
      <BackgroundElements />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection scrollYProgress={scrollYProgress} />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Demo Section */}
      <DemoSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
