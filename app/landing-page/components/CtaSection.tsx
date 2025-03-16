"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-12 rounded-2xl border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your JSON Experience?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Start visualizing your data today with our powerful, intuitive
            tools. No credit card required.
          </p>
          <Link href="/editor">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 h-12 px-8 cursor-pointer"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
