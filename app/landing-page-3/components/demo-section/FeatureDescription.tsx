import React from "react";

interface FeaturePoint {
  text: string;
}

interface FeatureDescriptionProps {
  title: string;
  description: string;
  features: FeaturePoint[];
}

export default function FeatureDescription({
  title,
  description,
  features,
}: FeatureDescriptionProps) {
  return (
    <>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-white/70 mb-6">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            </div>
            <span className="text-white/70">{feature.text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}