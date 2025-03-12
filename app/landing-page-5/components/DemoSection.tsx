"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// Sample JSON for the demo
const sampleJsonData = {
  company: "TechCorp",
  founded: 2010,
  location: {
    city: "San Francisco",
    country: "USA",
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  employees: [
    {
      id: 1,
      name: "John Smith",
      role: "CEO",
      skills: ["leadership", "strategy", "innovation"],
    },
    {
      id: 2,
      name: "Jane Doe",
      role: "CTO",
      skills: ["programming", "architecture", "cloud"],
    },
  ],
  products: [
    {
      id: "p1",
      name: "TechApp",
      category: "Software",
      pricing: {
        monthly: 29.99,
        yearly: 299.99,
      },
    },
    {
      id: "p2",
      name: "DataAnalyzer",
      category: "Service",
      pricing: {
        monthly: 49.99,
        yearly: 499.99,
      },
    },
  ],
  active: true,
};

// Define interfaces for component props
interface NodeProps {
  label: string;
  value?: any;
  x: number;
  y: number;
  delay: number;
  isObject?: boolean;
  isArray?: boolean;
  isExpanded?: boolean;
  onToggle: () => void;
}

// Node component for visualization
const Node = ({
  label,
  value,
  x,
  y,
  delay,
  isObject = false,
  isArray = false,
  isExpanded = true,
  onToggle,
}: NodeProps) => {
  const color = isObject
    ? "bg-gradient-to-r from-sky-500 to-blue-600"
    : isArray
    ? "bg-gradient-to-r from-purple-500 to-indigo-600"
    : "bg-gradient-to-r from-emerald-500 to-teal-600";

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}px` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <motion.div
        className={`rounded-lg shadow-lg cursor-pointer ${
          isExpanded ? "mb-2" : "mb-0"
        }`}
        whileHover={{ scale: 1.05 }}
        onClick={onToggle}
      >
        <div
          className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${color}`}
        >
          {label}
          {(isObject || isArray) && (
            <span className="ml-2">{isExpanded ? "▼" : "►"}</span>
          )}
        </div>
      </motion.div>

      {value !== undefined && isExpanded && (
        <motion.div
          className="ml-6 px-3 py-1 bg-slate-800/50 backdrop-blur-sm rounded border border-white/10 text-white/80 text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {typeof value === "string" ? `"${value}"` : value.toString()}
        </motion.div>
      )}
    </motion.div>
  );
};

interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}

// Connection line component
const ConnectionLine = ({ startX, startY, endX, endY, delay }: ConnectionLineProps) => {
  const pathRef = useRef(null);

  return (
    <motion.svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.path
        ref={pathRef}
        d={`M ${startX}% ${startY} C ${startX}% ${
          (startY + endY) / 2
        }, ${endX}% ${(startY + endY) / 2}, ${endX}% ${endY}`}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedNodes, setExpandedNodes] = useState({
    root: true, // Add the root node to the state
    company: true,
    founded: true,
    location: true,
    "location.city": true,
    "location.country": true,
    "location.coordinates": true,
    "location.coordinates.lat": true,
    "location.coordinates.lng": true,
    employees: true,
    "employees.0": true,
    "employees.0.id": true,
    "employees.0.name": true,
    "employees.0.role": true,
    "employees.0.skills": true,
    "employees.1": false,
    products: false,
    active: true,
  });

  const toggleNode = (nodePath: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodePath]: !prev[nodePath as keyof typeof prev],
    }));
  };

  return (
    <section id="demo" className="py-20 bg-slate-950/50 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Interactive visualization of complex JSON structures
            </p>
          </motion.div>
        </div>

        <div
          ref={ref}
          className="relative bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-xl p-6 h-[600px] overflow-hidden"
        >
          {isInView && (
            <>
              {/* Root node */}
              <Node
                label="Root Object"
                x={10}
                y={50}
                delay={0.2}
                isObject={true}
                isExpanded={expandedNodes["root"]}
                onToggle={() => toggleNode("root")}
              />

              {/* Company */}
              <Node
                label="company"
                value={sampleJsonData.company}
                x={25}
                y={120}
                delay={0.4}
                isExpanded={expandedNodes["company"]}
                onToggle={() => toggleNode("company")}
              />
              <ConnectionLine
                startX={10}
                startY={65}
                endX={25}
                endY={130}
                delay={0.3}
              />

              {/* Founded */}
              <Node
                label="founded"
                value={sampleJsonData.founded}
                x={25}
                y={180}
                delay={0.5}
                isExpanded={expandedNodes["founded"]}
                onToggle={() => toggleNode("founded")}
              />
              <ConnectionLine
                startX={10}
                startY={65}
                endX={25}
                endY={190}
                delay={0.4}
              />

              {/* Location */}
              <Node
                label="location"
                x={25}
                y={240}
                delay={0.6}
                isObject={true}
                isExpanded={expandedNodes["location"]}
                onToggle={() => toggleNode("location")}
              />
              <ConnectionLine
                startX={10}
                startY={65}
                endX={25}
                endY={250}
                delay={0.5}
              />

              {expandedNodes["location"] && (
                <>
                  {/* Location city */}
                  <Node
                    label="city"
                    value={sampleJsonData.location.city}
                    x={40}
                    y={300}
                    delay={0.7}
                    isExpanded={expandedNodes["location.city"]}
                    onToggle={() => toggleNode("location.city")}
                  />
                  <ConnectionLine
                    startX={25}
                    startY={255}
                    endX={40}
                    endY={310}
                    delay={0.6}
                  />

                  {/* Location country */}
                  <Node
                    label="country"
                    value={sampleJsonData.location.country}
                    x={40}
                    y={360}
                    delay={0.8}
                    isExpanded={expandedNodes["location.country"]}
                    onToggle={() => toggleNode("location.country")}
                  />
                  <ConnectionLine
                    startX={25}
                    startY={255}
                    endX={40}
                    endY={370}
                    delay={0.7}
                  />

                  {/* Coordinates */}
                  <Node
                    label="coordinates"
                    x={40}
                    y={420}
                    delay={0.9}
                    isObject={true}
                    isExpanded={expandedNodes["location.coordinates"]}
                    onToggle={() => toggleNode("location.coordinates")}
                  />
                  <ConnectionLine
                    startX={25}
                    startY={255}
                    endX={40}
                    endY={430}
                    delay={0.8}
                  />

                  {expandedNodes["location.coordinates"] && (
                    <>
                      {/* Lat */}
                      <Node
                        label="lat"
                        value={sampleJsonData.location.coordinates.lat}
                        x={55}
                        y={480}
                        delay={1.0}
                        isExpanded={expandedNodes["location.coordinates.lat"]}
                        onToggle={() => toggleNode("location.coordinates.lat")}
                      />
                      <ConnectionLine
                        startX={40}
                        startY={435}
                        endX={55}
                        endY={490}
                        delay={0.9}
                      />

                      {/* Lng */}
                      <Node
                        label="lng"
                        value={sampleJsonData.location.coordinates.lng}
                        x={55}
                        y={540}
                        delay={1.1}
                        isExpanded={expandedNodes["location.coordinates.lng"]}
                        onToggle={() => toggleNode("location.coordinates.lng")}
                      />
                      <ConnectionLine
                        startX={40}
                        startY={435}
                        endX={55}
                        endY={550}
                        delay={1.0}
                      />
                    </>
                  )}
                </>
              )}

              {/* Employees */}
              <Node
                label="employees"
                x={25}
                y={120}
                delay={1.2}
                isArray={true}
                isExpanded={expandedNodes["employees"]}
                onToggle={() => toggleNode("employees")}
              />
              <ConnectionLine
                startX={10}
                startY={65}
                endX={25}
                endY={130}
                delay={1.1}
              />

              {expandedNodes["employees"] && (
                <>
                  {/* Employee 0 */}
                  <Node
                    label="[0]"
                    x={40}
                    y={180}
                    delay={1.3}
                    isObject={true}
                    isExpanded={expandedNodes["employees.0"]}
                    onToggle={() => toggleNode("employees.0")}
                  />
                  <ConnectionLine
                    startX={25}
                    startY={135}
                    endX={40}
                    endY={190}
                    delay={1.2}
                  />

                  {expandedNodes["employees.0"] && (
                    <>
                      {/* Employee 0 ID */}
                      <Node
                        label="id"
                        value={sampleJsonData.employees[0].id}
                        x={55}
                        y={240}
                        delay={1.4}
                        isExpanded={expandedNodes["employees.0.id"]}
                        onToggle={() => toggleNode("employees.0.id")}
                      />
                      <ConnectionLine
                        startX={40}
                        startY={195}
                        endX={55}
                        endY={250}
                        delay={1.3}
                      />

                      {/* Employee 0 Name */}
                      <Node
                        label="name"
                        value={sampleJsonData.employees[0].name}
                        x={55}
                        y={300}
                        delay={1.5}
                        isExpanded={expandedNodes["employees.0.name"]}
                        onToggle={() => toggleNode("employees.0.name")}
                      />
                      <ConnectionLine
                        startX={40}
                        startY={195}
                        endX={55}
                        endY={310}
                        delay={1.4}
                      />

                      {/* Employee 0 Role */}
                      <Node
                        label="role"
                        value={sampleJsonData.employees[0].role}
                        x={55}
                        y={360}
                        delay={1.6}
                        isExpanded={expandedNodes["employees.0.role"]}
                        onToggle={() => toggleNode("employees.0.role")}
                      />
                      <ConnectionLine
                        startX={40}
                        startY={195}
                        endX={55}
                        endY={370}
                        delay={1.5}
                      />

                      {/* Employee 0 Skills */}
                      <Node
                        label="skills"
                        x={55}
                        y={420}
                        delay={1.7}
                        isArray={true}
                        isExpanded={expandedNodes["employees.0.skills"]}
                        onToggle={() => toggleNode("employees.0.skills")}
                      />
                      <ConnectionLine
                        startX={40}
                        startY={195}
                        endX={55}
                        endY={430}
                        delay={1.6}
                      />

                      {expandedNodes["employees.0.skills"] && (
                        <>
                          {sampleJsonData.employees[0].skills.map(
                            (skill, index) => (
                              <React.Fragment key={index}>
                                <Node
                                  label={`[${index}]`}
                                  value={skill}
                                  x={70}
                                  y={480 + index * 60}
                                  delay={1.8 + index * 0.1}
                                  isExpanded={true}
                                  onToggle={() => {}}
                                />
                                <ConnectionLine
                                  startX={55}
                                  startY={435}
                                  endX={70}
                                  endY={490 + index * 60}
                                  delay={1.7 + index * 0.1}
                                />
                              </React.Fragment>
                            )
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Employee 1 */}
                  <Node
                    label="[1]"
                    x={40}
                    y={480}
                    delay={2.0}
                    isObject={true}
                    isExpanded={expandedNodes["employees.1"]}
                    onToggle={() => toggleNode("employees.1")}
                  />
                  <ConnectionLine
                    startX={25}
                    startY={135}
                    endX={40}
                    endY={490}
                    delay={1.9}
                  />
                </>
              )}

              {/* Products */}
              <Node
                label="products"
                x={25}
                y={300}
                delay={2.1}
                isArray={true}
                isExpanded={expandedNodes["products"]}
                onToggle={() => toggleNode("products")}
              />
              <ConnectionLine
                startX={10}
                startY={65}
                endX={25}
                endY={310}
                delay={2.0}
              />

              {/* Active */}
              <Node
                label="active"
                value={sampleJsonData.active}
                x={25}
                y={360}
                delay={2.2}
                isExpanded={expandedNodes["active"]}
                onToggle={() => toggleNode("active")}
              />
              <ConnectionLine
                startX={10}
                startY={65}
                endX={25}
                endY={370}
                delay={2.1}
              />
            </>
          )}

          {/* Interactive controls */}
          <div className="absolute bottom-4 right-4 flex gap-3">
            <motion.button
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Expand all nodes
                const allExpanded: Record<string, boolean> = {};
                Object.keys(expandedNodes).forEach((key) => {
                  allExpanded[key] = true;
                });
                setExpandedNodes(allExpanded as typeof expandedNodes);
              }}
            >
              Expand All
            </motion.button>
            <motion.button
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Collapse all nodes
                const allCollapsed: Record<string, boolean> = {};
                Object.keys(expandedNodes).forEach((key) => {
                  allCollapsed[key] = false;
                });
                // Keep root expanded
                allCollapsed["root"] = true;
                setExpandedNodes(allCollapsed as typeof expandedNodes);
              }}
            >
              Collapse All
            </motion.button>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-sky-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
          />
        </div>

        {/* Code snippet */}
        <div className="mt-12 max-w-3xl mx-auto">
          <motion.div
            className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-white/60 text-sm">data.json</span>
            </div>
            <pre className="p-4 text-sm text-emerald-400 overflow-x-auto">
              <code>{JSON.stringify(sampleJsonData, null, 2)}</code>
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
