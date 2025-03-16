"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../utils/superbase/client";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { AuthTabs } from "./AuthTabs";
import { VisualSide } from "./VisualSide";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const { theme } = useTheme();
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setSupabase(createClient());
  }, []);

  // Add this useEffect to check authentication state
  useEffect(() => {
    if (supabase) {
      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (event: string, session: { user: { id: any } }) => {
          if (event === "SIGNED_IN" && session) {
            // console.log("User signed in:", session.user.id);
            router.push("/protected/billing");
          }
        }
      );

      // Check if user is already logged in
      const checkUser = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // console.log("User already logged in:", session.user.id);
          router.push("/");
        }
      };

      checkUser();

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [supabase, router]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setMessage(null);

    try {
      // Get returnTo from URL parameters
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/editor"; // Default to editor

      // Instead of trying to check if the user exists with a dummy password,
      // we'll directly attempt to sign up and handle any "already registered" errors
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${
            window.location.origin
          }/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
        },
      });

      if (error) {
        // Handle specific error for existing user
        if (error.message.includes("already registered")) {
          setMessage(
            "This email is already registered. Please sign in instead."
          );
        } else {
          setMessage(error.message);
        }
      } else if (signUpData.user) {
        // Check if email confirmation is required
        if (signUpData.session) {
          // User is automatically signed in (email confirmation not required)
          setMessage("Account created successfully! Redirecting...");
          // Add a success class to style the message
          document
            .getElementById("auth-message")
            ?.classList.add(
              "bg-green-100",
              "text-green-800",
              "border-green-300"
            );

          // Redirect to the specified path
          router.push(returnTo);
        } else {
          // Email confirmation is required
          setMessage(
            "Account created! Please check your email to confirm your account before signing in."
          );
          // Add a success class to style the message
          document
            .getElementById("auth-message")
            ?.classList.add(
              "bg-green-100",
              "text-green-800",
              "border-green-300"
            );
        }
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        // Get returnTo from URL parameters
        const params = new URLSearchParams(window.location.search);
        const returnTo = params.get("returnTo") || "/editor"; // Default to editor

        // Redirect to the specified path
        router.push(returnTo);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) return;

    setLoading(true);
    setMessage(null);

    try {
      // Get returnTo from URL parameters
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/editor"; // Default to editor

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${
            window.location.origin
          }/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
        },
      });

      if (error) {
        setMessage(error.message);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 rounded-full border-3 border-t-transparent border-blue-600 dark:border-blue-400 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-slate-950">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Visual Flow Pro
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {activeTab === "signin" ? "Welcome back" : "Create your account"}
            </p>
          </div>

          <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <AnimatePresence mode="wait">
            {activeTab === "signin" ? (
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                handleSignIn={handleSignIn}
                handleGoogleSignIn={handleGoogleSignIn}
                loading={loading}
                message={message}
              />
            ) : (
              <SignUpForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                handleSignUp={handleSignUp}
                handleGoogleSignIn={handleGoogleSignIn}
                loading={loading}
                message={message}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side - Visual element */}
      <VisualSide />
    </div>
  );
}
