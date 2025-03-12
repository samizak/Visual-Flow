"use client";

import { motion } from "framer-motion";
import { 
  Network, 
  Zap, 
  Share2, 
  Lock, 
  FileJson, 
  Sparkles 
} from "lucide-react";

const features = [
  {
    icon: <Network className="h-6 w-6" />,
    title: "Interactive Visualizations",
    description:
      "Transform complex JSON structures into intuitive, interactive flowcharts that make data relationships clear at a glance.",
    color: "from-sky-500 to-blue-600",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Real-time Processing",
    description:
      "Instantly visualize your JSON data with our lightning-fast processing engine, even for large and complex structures.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    title: "Collaboration Tools",
    description:
      "Share your visualizations with team members and collaborate in real-time with comments and annotations.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Secure Data Handling",
    description:
      "Your data never leaves your browser. We process everything client-side for maximum security and privacy.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: <FileJson className="h-6 w-6" />,
    title: "Advanced Formatting",
    description:
      "Automatically format and validate your JSON with intelligent indentation, syntax highlighting, and error detection.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI-Powered Insights",
    description:
      "Get smart suggestions and insights about your data structure with our AI-powered analysis tools.",
    color: "from-violet-500 to-purple-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Developers
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to understand and work with complex JSON data
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-slate-800/70 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-slate-800/90 transition-all duration-300 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-4 relative inline-block">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-lg blur-md opacity-90`}></div>
                <div className="relative bg-slate-800 p-3 rounded-lg border border-white/10">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}