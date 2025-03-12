"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const monthlyPrice = 5;
  const yearlyPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with JSON visualization",
      features: [
        "Basic JSON visualization",
        "Up to 1MB file size",
        "Standard export options",
        "Community support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: isYearly ? `$${yearlyPrice}` : `$${monthlyPrice}`,
      period: isYearly ? "/year" : "/month",
      description: "Advanced features for professional developers and teams",
      features: [
        "Advanced visualization options",
        "Unlimited file size",
        "Custom themes and branding",
        "Priority support",
        "Team management",
        "Custom integrations",
        "Advanced security features",
        "On-premise deployment option",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Choose the plan that&apos;s right for you
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center mb-8">
              <span
                className={`mr-3 ${!isYearly ? "text-white" : "text-white/60"}`}
              >
                Monthly
              </span>
              <div
                className="relative w-14 h-7 bg-slate-700 rounded-full cursor-pointer"
                onClick={() => setIsYearly(!isYearly)}
              >
                <div className="absolute inset-1 flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full bg-indigo-500 shadow-md transform transition-transform duration-300 ${
                      isYearly ? "translate-x-7" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
              <span
                className={`ml-3 ${isYearly ? "text-white" : "text-white/60"}`}
              >
                Yearly
              </span>
              <span className="ml-2 text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
                Save 20%
              </span>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="relative rounded-xl overflow-hidden border border-white/10 hover:border-indigo-500/70 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  RECOMMENDED
                </div>
              )}
              <div className="p-8 bg-slate-800/50 backdrop-blur-sm h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end mb-2">
                    <span className="text-4xl font-bold">
                      {plan.popular
                        ? isYearly
                          ? `$${Math.round(yearlyPrice / 12)}`
                          : plan.price
                        : plan.price}
                    </span>
                    <span className="text-white/70 ml-1">/month</span>
                  </div>
                  {plan.popular && isYearly && (
                    <div className="text-sm text-indigo-300 mb-2">
                      Billed annually (${yearlyPrice}/year)
                    </div>
                  )}
                  <p className="text-white/70">{plan.description}</p>
                </div>

                <div className="mb-8 flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Check
                            className={`h-5 w-5 ${
                              plan.popular ? "text-indigo-400" : "text-white/70"
                            }`}
                          />
                        </div>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/editor" className="mt-auto">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-indigo-500 hover:bg-indigo-600"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-white/60">
            Need a custom solution?{" "}
            <Link
              href="#contact"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Contact us
            </Link>{" "}
            for custom pricing.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
