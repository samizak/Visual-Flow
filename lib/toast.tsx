"use client";
import { toast as sonnerToast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";
import React from "react";

// Base toast options
const baseToastOptions = {
  duration: 2000,
  className: "custom-toast border shadow-lg",
};

// Success toast with improved styling
export function successToast(message: string, options?: any) {
  return sonnerToast.custom(
    () => (
      <div className="flex items-center w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-green-500/20 p-2 rounded-full flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">Success</h3>
            <p className="text-sm text-gray-300 mt-1">{message}</p>
          </div>
        </div>
      </div>
    ),
    {
      ...baseToastOptions,
      ...options,
      className: `${baseToastOptions.className} border-green-800/30 bg-[#1a2721]`,
    }
  );
}

// Error toast with improved styling
export function errorToast(message: string, options?: any) {
  return sonnerToast.custom(
    () => (
      <div className="flex items-center w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-red-500/20 p-2 rounded-full flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">Error</h3>
            <p className="text-sm text-gray-300 mt-1">{message}</p>
          </div>
        </div>
      </div>
    ),
    {
      ...baseToastOptions,
      ...options,
      className: `${baseToastOptions.className} border-red-800/30 bg-[#271a1a]`,
    }
  );
}

// Info toast with consistent styling
export function infoToast(message: string, options?: any) {
  return sonnerToast.custom(
    () => (
      <div className="flex items-center w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-blue-500/20 p-2 rounded-full flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">Info</h3>
            <p className="text-sm text-gray-300 mt-1">{message}</p>
          </div>
        </div>
      </div>
    ),
    {
      ...baseToastOptions,
      ...options,
      className: `${baseToastOptions.className} border-blue-800/30 bg-[#1a2027]`,
    }
  );
}

// Re-export the original toast for other use cases
export const toast = sonnerToast;
