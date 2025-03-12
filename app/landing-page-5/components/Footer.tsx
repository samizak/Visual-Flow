"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileJson, Github, Twitter, Linkedin, Mail } from "lucide-react";

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
      { name: "API Reference", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Tutorials", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 relative z-10 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-slate-900 p-2 rounded-full">
                  <FileJson className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-purple-500">
                JSONify
              </span>
            </Link>
            <p className="text-white/60 mb-6 max-w-md">
              Transform complex JSON data into beautiful, interactive visualizations that make data exploration effortless.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white/70 hover:text-white hover:bg-slate-700 transition-colors"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white/70 hover:text-white hover:bg-slate-700 transition-colors"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white/70 hover:text-white hover:bg-slate-700 transition-colors"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white/70 hover:text-white hover:bg-slate-700 transition-colors"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} JSONify. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}