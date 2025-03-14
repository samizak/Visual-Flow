"use client";
import { toast as sonnerToast } from "sonner";
import { CheckCircle2, AlertCircle } from "lucide-react";
import React from "react";

// Base toast options
const baseToastOptions = {
  duration: 3000,
  className: "custom-toast border shadow-lg z-[9999]",
};

// Success toast with improved styling
export function successToast(message: string, options?: any) {
  return sonnerToast.custom(
    () => (
      <div className="flex items-center w-full p-2">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-green-500/30 p-2 rounded-full flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">Success</h3>
            <p className="text-sm text-white mt-1">{message}</p>
          </div>
        </div>
      </div>
    ),
    {
      ...baseToastOptions,
      ...options,
      className: `${baseToastOptions.className} border-green-600/40 bg-gradient-to-r from-green-900/50 to-green-800/40`,
    }
  );
}

// Error toast with improved styling
export function errorToast(message: string, options?: any) {
  return sonnerToast.custom(
    () => (
      <div className="flex items-center w-full p-2">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-red-500/30 p-2 rounded-full flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">Error</h3>
            <p className="text-sm text-white mt-1">{message}</p>
          </div>
        </div>
      </div>
    ),
    {
      ...baseToastOptions,
      ...options,
      className: `${baseToastOptions.className} border-red-600/40 bg-gradient-to-r from-red-900/50 to-red-800/40`,
    }
  );
}

// Info toast with consistent styling
export function infoToast(message: string, options?: any) {
  return sonnerToast.custom(
    () => (
      <div className="flex items-center w-full p-2">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-blue-500/30 p-2 rounded-full flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white">Info</h3>
            <p className="text-sm text-white mt-1">{message}</p>
          </div>
        </div>
      </div>
    ),
    {
      ...baseToastOptions,
      ...options,
      className: `${baseToastOptions.className} border-blue-600/40 bg-gradient-to-r from-blue-900/50 to-blue-800/40`,
    }
  );
}

// Re-export the original toast for other use cases
export const toast = sonnerToast;
