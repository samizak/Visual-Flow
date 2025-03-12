"use client";

import React from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  avatar: string;
  delay: number;
}

function Testimonial({
  content,
  author,
  role,
  avatar,
  delay,
}: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="bg-slate-800/50 border-slate-700 h-full">
        <CardContent className="pt-6">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-slate-300 mb-6">{content}</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={avatar} alt={author} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{author}</p>
              <p className="text-sm text-slate-400">{role}</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      content:
        "Visual Flow has completely changed how I work with JSON data. The 3D visualization makes it so much easier to understand complex structures.",
      author: "Alex Morgan",
      role: "Frontend Developer",
      avatar: "/avatars/alex.jpg",
    },
    {
      content:
        "I use this tool daily for debugging API responses. Being able to visualize the data structure saves me hours of development time.",
      author: "Sarah Chen",
      role: "Full Stack Engineer",
      avatar: "/avatars/sarah.jpg",
    },
    {
      content:
        "The best JSON visualization tool I've ever used. The interface is intuitive and the 3D view helps me spot patterns I would have missed.",
      author: "Michael Rodriguez",
      role: "Data Scientist",
      avatar: "/avatars/michael.jpg",
    },
  ];

  return (
    <section id="testimonials" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Join thousands of developers who are already using Visual Flow
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
