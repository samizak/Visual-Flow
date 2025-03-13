import React from "react";
import { Button } from "../../../../components/ui/button";
import FeatureDescription from "./FeatureDescription";

export default function ShareTab() {
  const shareFeatures = {
    title: "Seamless Sharing",
    description:
      "Export your visualizations in multiple formats or generate shareable links to collaborate with your team without sharing the raw data.",
    features: [
      { text: "Export as PNG, SVG, or interactive HTML" },
      { text: "Generate shareable links" },
      { text: "Embed in documentation or websites" },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <FeatureDescription
          title={shareFeatures.title}
          description={shareFeatures.description}
          features={shareFeatures.features}
        />
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0">
          Try Sharing Features
        </Button>
      </div>
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
              <span className="text-white/40">PNG Export</span>
            </div>
            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
              <span className="text-white/40">SVG Export</span>
            </div>
            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
              <span className="text-white/40">HTML Export</span>
            </div>
            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
              <span className="text-white/40">Share Link</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
