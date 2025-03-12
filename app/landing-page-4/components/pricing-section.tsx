"use client";

import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  delay: number;
}

function PricingTier({
  name,
  price,
  description,
  features,
  highlighted = false,
  delay,
}: PricingTierProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div
        className={`h-full rounded-xl p-8 border ${
          highlighted
            ? "border-indigo-500 bg-indigo-500/10"
            : "border-slate-700 bg-slate-800/50"
        }`}
      >
        {highlighted && (
          <div className="bg-indigo-500 text-white text-xs font-medium px-3 py-1 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-slate-400">/month</span>}
        </div>
        <p className="text-slate-400 mb-6">{description}</p>
        <Link href="/editor" className="block mb-8">
          <Button
            className={`w-full ${
              highlighted
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {price === "Free" ? "Get Started" : "Try Free for 14 Days"}
          </Button>
        </Link>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center ${
                  highlighted ? "bg-indigo-500/20" : "bg-slate-700"
                }`}
              >
                <Check
                  className={`h-3 w-3 ${
                    highlighted ? "text-indigo-400" : "text-slate-400"
                  }`}
                />
              </div>
              <span className="text-slate-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function PricingSection() {
  const tiers = [
    {
      name: "Free",
      price: "Free",
      description: "Perfect for trying out Visual Flow",
      features: [
        "Basic JSON visualization",
        "Up to 1MB file size",
        "Standard export options",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "$12",
      description: "For professional developers",
      features: [
        "Advanced 3D visualization",
        "Up to 10MB file size",
        "All export options",
        "Schema detection",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Team",
      price: "$49",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Unlimited file size",
        "Team collaboration",
        "Custom branding",
        "API access",
        "Dedicated support",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Choose the plan that&apos;s right for you
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, index) => (
            <PricingTier
              key={index}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              highlighted={tier.highlighted}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
