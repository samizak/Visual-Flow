"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface AuthFormContentProps {
  formType: "signin" | "signup";
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
  loading: boolean;
  message: string | null;
}

export function AuthFormContent({
  formType,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  handleSubmit,
  handleGoogleAuth,
  loading,
  message,
}: AuthFormContentProps) {
  const isSignIn = formType === "signin";
  
  return (
    <motion.div
      key={formType}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Google Auth Button */}
        <Button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full h-11 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
          disabled={loading}
        >
          <FcGoogle className="h-5 w-5" />
          <span>Sign {isSignIn ? "in" : "up"} with Google</span>
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
            htmlFor={`${formType}-email`}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              id={`${formType}-email`}
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
          {isSignIn ? (
            <div className="flex justify-between">
              <label
                htmlFor={`${formType}-password`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          ) : (
            <label
              htmlFor={`${formType}-password`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
          )}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              id={`${formType}-password`}
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
          {!isSignIn && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Password must be at least 8 characters
            </p>
          )}
        </div>

        {message && (
          <div
            id="auth-message"
            className={`p-4 rounded-lg shadow-sm mb-4 flex items-center ${
              message.includes("successfully") ||
              message.includes("check your email")
                ? "bg-green-50 text-green-700 border-l-4 border-green-500 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 border-l-4 border-red-500 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            <div
              className={`mr-3 ${
                message.includes("successfully") ||
                message.includes("check your email")
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {message.includes("successfully") ||
              message.includes("check your email") ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-11 font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                <span>{isSignIn ? "Signing in..." : "Creating account..."}</span>
              </div>
            ) : (
              isSignIn ? "Sign in" : "Create Account"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}