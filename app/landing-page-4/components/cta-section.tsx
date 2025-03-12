"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

          <div className="relative p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Transform Your JSON Experience?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of developers who are already using Visual Flow to
              make sense of their JSON data.
            </p>
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-white/90"
              >
                Start Visualizing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
