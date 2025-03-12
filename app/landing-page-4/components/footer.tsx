import React from "react";
import Link from "next/link";
import { FileJson, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Demo", href: "#demo" },
        { name: "Roadmap", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Support", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur opacity-70"></div>
                <div className="relative bg-slate-900 p-2 rounded-full">
                  <FileJson className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">Visual Flow</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Transform complex JSON data into beautiful, interactive 3D
              visualizations that bring your data to life.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <Github className="h-5 w-5 text-slate-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <Twitter className="h-5 w-5 text-slate-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-slate-400" />
              </a>
            </div>
          </div>

          {footerLinks.map((column, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {currentYear} Visual Flow. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-500 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-slate-500 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-slate-500 hover:text-white text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}