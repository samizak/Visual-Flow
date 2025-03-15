import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Crown, Check, Sparkles, ShieldCheck } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  featureName,
}: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const pricing = {
    monthly: {
      price: "$5",
      period: "month",
      description: "Advanced features for professional developers and teams",
    },
    yearly: {
      price: "$4",
      period: "month",
      description: "Advanced features for professional developers and teams",
      savings: "Save $12",
      discount: "20% off",
      yearlyTotal: "$48/year",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#1e1e1e] border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <Crown className="h-5 w-5 text-yellow-400" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {featureName
              ? `The "${featureName}" feature is available exclusively for Pro users.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {/* Pricing section */}
        <div className="py-3 px-1">
          <div className="flex justify-center items-center mb-4 relative">
            <div className="bg-gray-800 p-1 rounded-full inline-flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gray-700 text-yellow-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "yearly"
                    ? "bg-gray-700 text-yellow-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Yearly
              </button>
            </div>
            <span className="absolute -top-2 right-[calc(50%-60px)] bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pricing.yearly.discount}
            </span>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">Pro Plan</h3>
                <p className="text-sm text-gray-400">
                  {pricing[billingCycle].description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-end justify-end">
                  <span className="text-2xl font-bold text-white">
                    {pricing[billingCycle].price}
                  </span>
                  <span className="text-gray-400 ml-1">
                    /{pricing[billingCycle].period}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <span className="inline-block bg-green-900/30 text-green-400 text-xs font-medium px-2 py-0.5 rounded-full mt-1 whitespace-nowrap">
                    Billed annually ({pricing.yearly.yearlyTotal})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="py-2">
          <h3 className="font-medium mb-2 text-white">Pro benefits include:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Import JSON from images with OCR technology</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Export visualizations as PNG, JPG, and SVG</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Visualize larger and more complex JSON structures</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Save and manage visualizations in the cloud</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex sm:justify-between gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 cursor-pointer"
          >
            Maybe Later
          </Button>
          <Button
            onClick={onUpgrade}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            Upgrade Now
          </Button>
        </DialogFooter>

        <div className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
          30-day money-back guarantee. Cancel anytime.
        </div>
      </DialogContent>
    </Dialog>
  );
}
