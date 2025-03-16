"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/Auth/SupabaseProvider";
import { successToast } from "@/lib/toast";

export default function SuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshSubscription } = useSupabase();

  // Add this console log to check if the component is being rendered at all
  // console.log("Success page component rendered");

  useEffect(() => {
    // console.log("useEffect in SuccessPage is running");

    // Log all search params to see what's coming through
    // console.log("All search params:", Object.fromEntries([...searchParams.entries()]));

    const sessionId = searchParams.get("session_id");
    // console.log("Session ID from URL:", sessionId);

    if (!sessionId) {
      console.error("No session ID found in URL");
      setError("Invalid session");
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      // console.log("Starting payment verification for session:", sessionId);
      try {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        // console.log("Verify payment response status:", response.status);
        const data = await response.json();
        // console.log("Verify payment response data:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify payment");
        }

        // Payment verified successfully
        // console.log("Payment verified successfully, refreshing subscription");

        // Refresh the subscription status in the context
        if (refreshSubscription) {
          await refreshSubscription();
          // console.log("Subscription refreshed in context");
        } else {
          console.error("refreshSubscription function is undefined");
        }

        // Show success toast
        successToast("Your subscription has been activated successfully!");

        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying payment:", error);
        setError("Failed to verify payment");
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, refreshSubscription]); // Remove user from dependencies if not needed

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
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              Start Using Pro Features
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
