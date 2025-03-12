"use client";

import React from "react";
import { motion } from "motion/react";
import { Braces, BarChart3, Share2, Zap, Shield, Layers } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="bg-slate-800/50 border-slate-700 hover:border-indigo-500/50 transition-all duration-300 h-full">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-slate-400 text-base">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: <Braces className="h-6 w-6 text-indigo-400" />,
      title: "Smart JSON Parsing",
      description:
        "Automatically parse and validate JSON data with intelligent error handling and suggestions.",
    },
    {
      icon: <Layers className="h-6 w-6 text-indigo-400" />,
      title: "3D Visualization",
      description:
        "Transform your JSON data into interactive 3D models that reveal structure and relationships.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-400" />,
      title: "Data Analysis",
      description:
        "Gain insights with automatic schema detection and statistical analysis of your JSON data.",
    },
    {
      icon: <Share2 className="h-6 w-6 text-indigo-400" />,
      title: "Easy Sharing",
      description:
        "Share your visualizations with a simple link or export them as interactive HTML.",
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-400" />,
      title: "Real-time Updates",
      description:
        "See your visualization update in real-time as you edit your JSON data.",
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-400" />,
      title: "Privacy First",
      description:
        "Your data never leaves your browser. All processing happens locally for maximum privacy.",
    },
  ];

  return (
    <section id="features" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to understand and work with complex JSON data
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
