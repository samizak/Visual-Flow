"use client";

import Link from "next/link";
import { FileJson } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-70"></div>
            <div className="relative bg-[#0f172a] p-2 rounded-full">
              <FileJson className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Visual Flow
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-white/70 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-white/70 hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-white/70 hover:text-white transition-colors"
          >
            Testimonials
          </Link>
        </div>

        <Link href="/app">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0">
            Try It Now
          </Button>
        </Link>
      </div>
    </nav>
  );
}