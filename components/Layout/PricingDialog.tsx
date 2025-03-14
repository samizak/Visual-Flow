import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PricingDialog({
  open,
  onOpenChange,
}: PricingDialogProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const features = [
    "Advanced visualization options",
    "Unlimited file size",
    "Custom themes and branding",
    "Priority support",
    "Team management",
    "Custom integrations",
    "Advanced security features",
    "On-premise deployment option",
  ];

  const pricing = {
    monthly: {
      price: "$5",
      period: "month",
      description: "Advanced features for professional developers and teams"
    },
    yearly: {
      price: "$4",
      period: "month",
      description: "Advanced features for professional developers and teams",
      savings: "Save $12",
      discount: "20% off",
      yearlyTotal: "$48/year"
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[650px] p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-0 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-2 duration-300"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500"></div>

        <DialogHeader className="p-6 pb-0">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-center pt-2 max-w-md mx-auto">
            {pricing[billingCycle].description}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {/* Billing toggle */}
          <div className="flex justify-center items-center mb-8 relative">
            <div className="bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full inline-flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Yearly
              </button>
            </div>
            {billingCycle === "yearly" && (
              <span className="absolute -top-2 right-[calc(50%-60px)] bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {pricing.yearly.discount}
              </span>
            )}
          </div>

          {/* Pricing card */}
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg overflow-hidden border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="p-6 pb-4 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Pro Plan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    For developers and teams
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">
                      {pricing[billingCycle].price}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1">
                      /{pricing[billingCycle].period}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                      Billed annually ({pricing.yearly.yearlyTotal})
                    </span>
                  )}
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 py-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                <span className="font-medium">Upgrade Now</span>
              </Button>
            </div>
            <div className="px-6 pb-6">
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <p className="text-sm font-medium mb-4">
                  Everything in the free plan, plus:
                </p>
                <ul className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mr-2">
                        <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row sm:justify-between gap-4 bg-transparent">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            30-day money-back guarantee. Cancel anytime.
          </div>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 cursor-pointer"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
