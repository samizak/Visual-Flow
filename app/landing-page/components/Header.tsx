import React from "react";
import Link from "next/link";
import { FileJson } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";

export default function Header() {
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for header height
        behavior: "smooth",
      });
    }
  };

  // Function to scroll to top when logo is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[999999] backdrop-blur-md bg-black/50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={scrollToTop}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-70"></div>
            <div className="relative bg-black p-2 rounded-full">
              <FileJson className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">Visual Flow</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-white/70 hover:text-white transition-colors"
            onClick={(e) => scrollToSection(e, "features")}
          >
            Features
          </a>
          <a
            href="#demo"
            className="text-white/70 hover:text-white transition-colors"
            onClick={(e) => scrollToSection(e, "demo")}
          >
            Demo
          </a>
          <a
            href="#workflow"
            className="text-white/70 hover:text-white transition-colors"
            onClick={(e) => scrollToSection(e, "workflow")}
          >
            Workflow
          </a>
          <a
            href="#pricing"
            className="text-white/70 hover:text-white transition-colors"
            onClick={(e) => scrollToSection(e, "pricing")}
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/samizak/Visual-Flow"
            target="_blank"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white cursor-pointer"
            >
              <SiGithub className="h-6 w-6 mr-2" />
              GitHub
            </Button>
          </Link>
          <Link href="/editor">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 cursor-pointer">
              Try Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
