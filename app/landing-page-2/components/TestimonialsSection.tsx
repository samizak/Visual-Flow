"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "JSONify has completely changed how I work with API responses. The visualizations make it so much easier to understand complex data structures.",
    author: "Alex Chen",
    role: "Frontend Developer",
    avatar: "AC",
  },
  {
    quote:
      "I use this tool daily for debugging our backend services. Being able to visualize the JSON responses has cut my debugging time in half.",
    author: "Sarah Johnson",
    role: "Backend Engineer",
    avatar: "SJ",
  },
  {
    quote:
      "As someone who works with complex nested JSON data, this tool is a lifesaver. The interactive flowcharts make it easy to navigate through the structure.",
    author: "Michael Rodriguez",
    role: "Data Scientist",
    avatar: "MR",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Developers Say
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join thousands of satisfied developers using Visual Flow
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-[#1a2234] p-6 rounded-xl border border-white/10 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-3 -left-3 text-4xl text-indigo-500 opacity-50">
                &quot;
              </div>
              <p className="text-white/80 mb-6 relative z-10">
                {testimonial.quote}
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}