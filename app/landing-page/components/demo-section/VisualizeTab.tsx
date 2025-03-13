import React from "react";
import FeatureDescription from "./FeatureDescription";
import ImageCarousel from "./ImageCarousel";

interface VisualizeTabProps {
  currentImageIndex: number;
  demoImages: Array<{ src: string; alt: string }>;
  onPrevImage: () => void;
  onNextImage: () => void;
  onOpenPopup: () => void;
}

export default function VisualizeTab({
  currentImageIndex,
  demoImages,
  onPrevImage,
  onNextImage,
  onOpenPopup,
}: VisualizeTabProps) {
  // Feature descriptions for each image
  const featureData = [
    {
      title: "JSON Visualization",
      description:
        "Visual Flow transforms complex JSON data into clear, intuitive visual representations. Easily understand the structure, relationships, and hierarchy of your data without parsing through raw code.",
      features: [
        { text: "Clear node-based visualization" },
        { text: "Intuitive data structure mapping" },
        { text: "Simplified data exploration" },
      ],
    },
    {
      title: "Intelligent Node Highlighting",
      description:
        "Easily identify and focus on specific nodes within complex JSON structures. Our highlighting feature makes it simple to track relationships and understand data connections at a glance.",
      features: [
        { text: "Highlight connected nodes" },
        { text: "Track data relationships visually" },
        { text: "Focus on specific data paths" },
      ],
    },
    {
      title: "Detailed Node Information",
      description:
        "Inspect the raw JSON data for any node with a simple click. Get immediate access to values, types, and metadata without losing context of the overall structure.",
      features: [
        { text: "One-click data inspection" },
        { text: "View raw JSON values and types" },
        { text: "Copy node paths and values" },
      ],
    },
    {
      title: "Real-Time Error Detection",
      description:
        "Catch JSON syntax errors and structural issues as you type. Visual Flow provides immediate feedback with clear error highlighting and helpful suggestions for fixes.",
      features: [
        { text: "Instant syntax validation" },
        { text: "Visual error indicators" },
        { text: "Suggested error corrections" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start md:items-center">
      <div>
        <FeatureDescription
          title={featureData[currentImageIndex].title}
          description={featureData[currentImageIndex].description}
          features={featureData[currentImageIndex].features}
        />
      </div>
      <div>
        <ImageCarousel
          images={demoImages}
          currentIndex={currentImageIndex}
          onPrev={onPrevImage}
          onNext={onNextImage}
          onOpenPopup={onOpenPopup}
        />
      </div>
    </div>
  );
}
