"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/Auth/SupabaseProvider";
import { successToast } from "@/lib/toast";

// Create a separate component that uses useSearchParams
function SuccessContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshSubscription } = useSupabase();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    // Add a flag to track if we've already shown the toast
    let toastShown = false;

    if (!sessionId) {
      console.error("No session ID found in URL");
      setError("Invalid session");
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      // If we're already loading or have shown the toast, don't proceed
      if (!isLoading || toastShown) return;

      try {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify payment");
        }

        // Payment verified successfully
        if (refreshSubscription) {
          await refreshSubscription();
        } else {
          console.error("refreshSubscription function is undefined");
        }

        // Only show toast once
        if (!toastShown) {
          successToast("Your subscription has been activated successfully!");
          toastShown = true;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying payment:", error);
        setError("Failed to verify payment");
        setIsLoading(false);
      }
    };

    verifyPayment();

    // Cleanup function to prevent multiple verifications
    return () => {
      toastShown = true; // Prevent toast if component unmounts and remounts
    };
  }, [searchParams, refreshSubscription, isLoading]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10">
        {isLoading ? (
          <div className="text-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-indigo-500 animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Processing your payment</h2>
            <p className="text-white/70">
              Please wait while we confirm your subscription...
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="h-12 w-12 text-red-500 mx-auto mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <Button onClick={() => router.push("/pricing")}>Try Again</Button>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-white/70 mb-6">
              Thank you for upgrading to Pro! Your account has been upgraded and
              you now have access to all premium features.
            </p>
            <Button
              onClick={() => router.push("/editor")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer"
            >
              Start Using Pro Features
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-indigo-500 animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
