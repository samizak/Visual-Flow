"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { SupabaseProvider } from "@/components/Auth/SupabaseProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SupabaseProvider>
        {children}
        <Toaster />
      </SupabaseProvider>
    </ThemeProvider>
  );
}
