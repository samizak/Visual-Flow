"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import ImagePopup from "./ImagePopup";
import TabContent from "./demo-section/TabContent";
import { BarChart2, Share2, LineChart } from "lucide-react";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const demoImages = [
    { src: "/demos/demo.jpg", alt: "JSON Visualization" },
    { src: "/demos/demo2.jpg", alt: "Node Highlighting" },
    { src: "/demos/demo3.jpg", alt: "Node JSON Data" },
    { src: "/demos/demo4.jpg", alt: "Real-Time error detection" },
  ];

  // Disable scrolling when popup is open
  React.useEffect(() => {
    if (showImagePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showImagePopup]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % demoImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + demoImages.length) % demoImages.length
    );
  };

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
                  <LineChart className="h-3.5 w-3.5 transition-transform group-hover:scale-110 text-cyan-300 group-data-[state=active]:text-white" />
                  <span>Visualize</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="analyze"
                className="rounded-full px-4 py-2 z-10 transition-all duration-200 text-white/90 data-[state=active]:text-white data-[state=active]:font-medium hover:text-cyan-200 flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span className="relative flex items-center justify-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110 text-cyan-300 group-data-[state=active]:text-white" />
                  <span>Analyze</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="share"
                className="rounded-full px-4 py-2 z-10 transition-all duration-200 text-white/90 data-[state=active]:text-white data-[state=active]:font-medium hover:text-cyan-200 flex items-center justify-center gap-1.5 group cursor-pointer"
              >
                <span className="relative flex items-center justify-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110 text-cyan-300 group-data-[state=active]:text-white" />
                  <span>Share</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <TabContent
              activeTab={activeTab}
              currentImageIndex={currentImageIndex}
              demoImages={demoImages}
              sampleJson={sampleJson}
              onPrevImage={prevImage}
              onNextImage={nextImage}
              onOpenPopup={() => setShowImagePopup(true)}
            />
          </Tabs>
        </div>
      </div>

      <ImagePopup
        isOpen={showImagePopup}
        onClose={() => setShowImagePopup(false)}
        imageSrc={demoImages[currentImageIndex].src}
        imageAlt={demoImages[currentImageIndex].alt}
        onNext={nextImage}
        onPrev={prevImage}
        showNavigation={true}
        currentIndex={currentImageIndex}
        totalImages={demoImages.length}
      />
    </section>
  );
}
