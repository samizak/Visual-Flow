import type { Metadata } from "next";
import "../styles/main.css";
import { Toaster } from "../components/ui/sonner";
import { SupabaseProvider } from "../components/Auth/SupabaseProvider";

export const metadata: Metadata = {
  title: "Visual Flow - Data Visualizer",
  description: "A modern data visualization tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
