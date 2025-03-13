"use client";

import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleSignUp: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  loading: boolean;
  message: string | null;
}

export function SignUpForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  handleSignUp,
  handleGoogleSignIn,
  loading,
  message,
}: SignUpFormProps) {
  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleSignUp} className="space-y-5">
        {/* Google Sign Up Button */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full h-11 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
          disabled={loading}
        >
          <FcGoogle className="h-5 w-5" />
          <span>Sign up with Google</span>
        </Button>

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative px-4 bg-white dark:bg-slate-950 text-sm text-slate-500 dark:text-slate-400">
            or continue with email
          </div>
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <label
            htmlFor="signup-email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="pl-10 h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="pl-10 pr-10 h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Password must be at least 8 characters
          </p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`text-sm p-3 rounded-lg border ${
              message.includes("Check your email")
                ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/10 border-green-100 dark:border-green-900/20"
                : "text-red-500 bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20"
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
