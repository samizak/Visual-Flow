import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSON Vue - JSON Visualizer",
  description: "A modern JSON visualization tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="bottom-center"
          closeButton
          richColors
          theme="dark"
          toastOptions={{
            className: "border border-gray-700 rounded-lg shadow-lg",
            style: {
              padding: '12px 16px',
              backgroundColor: '#1e1e1e',
              color: '#ffffff',
              fontSize: '14px',
            },
            duration: 2000,
          }}
        />
      </body>
    </html>
  );
}
