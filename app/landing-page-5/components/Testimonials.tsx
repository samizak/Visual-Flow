"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Senior Developer at TechCorp",
    avatar: "/avatars/avatar-1.jpg",
    content:
      "JSONify has completely transformed how our team works with complex data structures. The visualizations make it so much easier to understand nested relationships at a glance.",
    rating: 5,
  },
  {
    id: 2,
    name: "Samantha Lee",
    role: "Data Scientist at AnalyticsPro",
    avatar: "/avatars/avatar-2.jpg",
    content:
      "As someone who works with JSON data daily, this tool has been a game-changer. The interactive visualizations help me spot patterns and issues that I would have missed otherwise.",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Full Stack Developer",
    avatar: "/avatars/avatar-3.jpg",
    content:
      "I've tried many JSON visualization tools, but this one stands out for its intuitive interface and powerful features. The real-time collaboration feature is especially useful for our remote team.",
    rating: 4,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "API Architect at CloudSystems",
    avatar: "/avatars/avatar-4.jpg",
    content:
      "This tool has saved me countless hours of debugging complex API responses. Being able to visualize the structure makes it so much easier to communicate with the team.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-slate-950/50 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Join thousands of developers who have transformed their workflow
            </p>
          </motion.div>
        </div>

        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overflow-hidden relative">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-500 rounded-full blur opacity-70"></div>
                        <div className="relative w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-white">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                        <p className="text-white/60 text-sm">{testimonial.role}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-white/80 italic">"{testimonial.content}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-10 w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
          >
            <ChevronLeft size={20} />
          </motion.button>
          
          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-10 w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
          >
            <ChevronRight size={20} />
          </motion.button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-gradient-to-r from-sky-500 to-purple-500 w-8"
                    : "bg-white/20"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}