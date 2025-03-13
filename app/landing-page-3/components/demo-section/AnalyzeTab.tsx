import React from "react";
import CodeEditor from "../CodeEditor";
import FeatureDescription from "./FeatureDescription";

interface AnalyzeTabProps {
  sampleJson: any;
}

export default function AnalyzeTab({ sampleJson }: AnalyzeTabProps) {
  const analyzeFeatures = {
    title: "Intelligent Analysis",
    description: "Visual Flow automatically analyzes your JSON structure to identify patterns, detect schemas, and highlight potential issues or optimizations.",
    features: [
      { text: "Schema detection and validation" },
      { text: "Data type analysis" },
      { text: "Structure optimization suggestions" },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <FeatureDescription
          title={analyzeFeatures.title}
          description={analyzeFeatures.description}
          features={analyzeFeatures.features}
        />
      </div>
      <div>
        <CodeEditor code={sampleJson} />
      </div>
    </div>
  );
}