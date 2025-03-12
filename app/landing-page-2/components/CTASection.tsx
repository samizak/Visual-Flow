"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Visualize Your JSON Data?
              </h2>
              <p className="text-xl text-white/70">
                Start transforming complex JSON structures into beautiful,
                interactive visualizations today.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <Link href="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 h-14 px-8 text-lg"
                >
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}