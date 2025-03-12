"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for getting started with basic JSON visualization",
    features: [
      "Basic JSON visualization",
      "Up to 5 saved projects",
      "Standard export options",
      "Community support",
      "1MB file size limit",
    ],
    notIncluded: [
      "Real-time collaboration",
      "Advanced visualization options",
      "API access",
      "Priority support",
    ],
    cta: "Get Started",
    popular: false,
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "Pro",
    price: { monthly: 12, yearly: 120 },
    description: "For professionals who need advanced visualization features",
    features: [
      "Everything in Free",
      "Unlimited saved projects",
      "Advanced visualization options",
      "Real-time collaboration",
      "10MB file size limit",
      "API access (100 requests/day)",
      "Email support",
    ],
    notIncluded: ["Priority support", "Custom branding"],
    cta: "Start Free Trial",
    popular: true,
    color: "from-purple-500 to-indigo-600",
  },
  {
    name: "Enterprise",
    price: { monthly: 49, yearly: 490 },
    description: "For teams that need advanced features and dedicated support",
    features: [
      "Everything in Pro",
      "Unlimited API access",
      "100MB file size limit",
      "Custom branding",
      "Priority support",
      "Dedicated account manager",
      "Custom integrations",
      "SSO authentication",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
    color: "from-pink-500 to-rose-600",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

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
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Choose the plan that works best for you and your team
            </p>
          </motion.div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center mt-8 mb-12">
            <span
              className={`mr-3 ${!annual ? "text-white" : "text-white/60"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-16 h-8 rounded-full bg-slate-800 flex items-center p-1 cursor-pointer"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-sky-500 to-purple-500"
                animate={{ x: annual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`ml-3 ${annual ? "text-white" : "text-white/60"}`}>
              Yearly{" "}
              <span className="text-emerald-400 text-sm font-medium">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-slate-800/70 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg ${
                plan.popular ? "md:-mt-4 md:mb-4" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold py-1.5 text-center">
                  MOST POPULAR
                </div>
              )}

              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{plan.name}</h3>
                <p className="text-white/70 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                    ${annual ? plan.price.yearly / 12 : plan.price.monthly}
                  </span>
                  <span className="text-white/70 ml-2">/month</span>
                  {annual && (
                    <div className="text-sm text-white/70 mt-1">
                      Billed annually (${plan.price.yearly}/year)
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3 rounded-lg bg-gradient-to-r ${plan.color} text-white font-medium mb-8 hover:shadow-lg hover:shadow-${plan.color.split(' ')[1]}/30 transition-all duration-300 border border-white/10`}
                >
                  {plan.cta}
                </button>

                <div className="space-y-4">
                  <p className="font-medium text-white/90">What&apos;s included:</p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}

                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="font-medium mt-6 text-white/90">Not included:</p>
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-start">
                          <X className="h-5 w-5 text-rose-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-white/70">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
