"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileJson, Menu, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { cn } from "../../../lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Demo", href: "#demo" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur opacity-70"></div>
            <div className="relative bg-slate-950 p-2 rounded-full">
              <FileJson className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">Visual Flow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/editor">
            <Button
              variant="default"
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-0"
            >
              Try Now
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-slate-900 border-slate-800">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur opacity-70"></div>
                    <div className="relative bg-slate-950 p-2 rounded-full">
                      <FileJson className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <span className="text-lg font-bold tracking-tight">
                    Visual Flow
                  </span>
                </Link>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </div>
              <nav className="flex flex-col gap-6 mb-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-slate-300 hover:text-white transition-colors text-lg"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Link href="/editor" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-0">
                    Try Now
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
