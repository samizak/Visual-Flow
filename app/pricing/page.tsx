"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeft, FileJson } from "lucide-react";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "../../components/Auth/SupabaseProvider";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();
  const { user } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  const monthlyPrice = 5;
  const yearlyPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount

  // Initialize Stripe
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const handleCheckout = async (planType: "monthly" | "yearly") => {
    setIsLoading(true);

    if (!user) {
      // Redirect to login if not logged in
      router.push(
        `/auth/login?returnTo=${encodeURIComponent("/protected/billing")}`
      );
      return;
    }

    try {
      // Create a checkout session on your server
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          planType: planType,
          email: user.email,
        }),
      });

      const { sessionId, checkoutError } = await response.json();
      if (checkoutError) {
        console.error("Failed to create session", checkoutError);
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Error redirecting to checkout:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Plans remain the same
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
      limitations: [
        "Limited to 100 nodes per visualization",
        "No OCR image processing",
        "No cloud storage for visualizations",
        "Basic styling options only",
      ],
      cta: "Get Started",
      ctaAction: () => router.push("/editor"),
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
        "OCR for extracting JSON from images",
        "Export as PNG, JPG, and SVG",
        "Custom themes and branding",
        "Priority support",
        "Team management",
        "Cloud storage for visualizations",
        "Advanced security features",
      ],
      cta: user ? "Upgrade Now" : "Sign Up",
      ctaAction: () => {
        if (user) {
          // Handle subscription process with Stripe
          handleCheckout(isYearly ? "yearly" : "monthly");
        } else {
          // Redirect to sign up with return URL
          router.push(
            `/auth/login?returnTo=${encodeURIComponent("/protected/billing")}`
          );
        }
      },
      popular: true,
    },
  ];

  const handleBackToEditor = () => {
    router.push("/editor");
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient - matching landing page */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-purple-900/20 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 py-4 relative z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-70"></div>
              <div className="relative bg-black p-2 rounded-full">
                <FileJson className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Visual Flow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white cursor-pointer"
              onClick={handleBackToEditor}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
            {!user && (
              <Link href="/auth/login">
                <Button variant="outline" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-16 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Get the right features for your JSON visualization needs
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center mb-8">
              <span
                className={`mr-3 ${
                  !isYearly ? "text-white" : "text-white/60"
                } cursor-pointer`}
                onClick={() => setIsYearly(false)}
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
                className={`ml-3 ${
                  isYearly ? "text-white" : "text-white/60"
                } cursor-pointer`}
                onClick={() => setIsYearly(true)}
              >
                Yearly
              </span>
              <span className="ml-2 text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
                Save 20%
              </span>
            </div>
          </motion.div>

          {/* Pricing Section */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative rounded-xl overflow-hidden border ${
                  plan.popular
                    ? "border-indigo-500/50"
                    : "border-white/10 hover:border-white/30"
                } transition-all duration-300 backdrop-blur-sm`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 z-20 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    RECOMMENDED
                  </div>
                )}
                <div className="p-8 bg-black/40 h-full flex flex-col">
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
                    <h4 className="font-medium mb-3 text-indigo-300">
                      What&apos;s included:
                    </h4>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="mr-3 mt-1">
                            <Check
                              className={`h-5 w-5 ${
                                plan.popular
                                  ? "text-indigo-400"
                                  : "text-white/70"
                              }`}
                            />
                          </div>
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations && (
                      <>
                        <h4 className="font-medium mb-3 text-white/70">
                          Limitations:
                        </h4>
                        <ul className="space-y-3">
                          {plan.limitations.map((limitation, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-white/60">
                                {limitation}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={plan.ctaAction}
                    className={`w-full cursor-pointer ${
                      plan.popular
                        ? "bg-indigo-500 hover:bg-indigo-600"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Frequently asked */}
          <motion.div
            className="mt-16 text-center max-w-3xl mx-auto p-8 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">
                  Can I cancel my subscription anytime?
                </h4>
                <p className="text-white/70">
                  Yes, you can cancel your subscription at any time. If you
                  cancel, you&apos;ll continue to have access to Pro features
                  until the end of your billing period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  Is there a free trial for the Pro plan?
                </h4>
                <p className="text-white/70">
                  We offer a 14-day free trial for the Pro plan. No credit card
                  required to try it out.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-white/70">
                  We accept all major credit cards, PayPal, and some regional
                  payment methods.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  Do you offer team discounts?
                </h4>
                <p className="text-white/70">
                  Yes, we offer discounts for teams of 5 or more. Please contact
                  us for more information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  How does the OCR feature work?
                </h4>
                <p className="text-white/70">
                  Our OCR technology allows you to extract JSON data from images
                  and screenshots. Simply upload an image containing JSON, and
                  our system will convert it to editable JSON format.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact us */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-white/60">
              Need a custom solution?{" "}
              <Link
                href="mailto:support@visualflow.com"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Contact us
              </Link>{" "}
              for custom pricing.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-16 relative z-10">
        <div className="container mx-auto px-6 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Visual Flow. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
