"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../utils/superbase/client";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { AuthTabs } from "./AuthTabs";
import { VisualSide } from "./VisualSide";
import { useRouter } from 'next/navigation';

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

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the confirmation link");
      // Store user data in Supabase
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user) {
          // Create a profile record in your profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: user.user.id, 
                email: email,
                created_at: new Date().toISOString(),
              }
            ]);
            
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        }
      } catch (err) {
        console.error("Error storing user data:", err);
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else if (data.user) {
      // Redirect to dashboard on successful login
      router.push('/');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    }
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