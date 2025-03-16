"use client";
import { useEffect, useState } from "react";

export function VisualSide() {
  const [animate, setAnimate] = useState(false);
  const [jsonIndex, setJsonIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [visibleChars, setVisibleChars] = useState(0);

  // Sample JSON datasets to cycle through
  const jsonSamples = [
    {
      name: "User Profile",
      id: 12345,
      preferences: {
        theme: "dark",
        notifications: true,
      },
    },
    {
      products: [
        { id: 1, name: "Widget", price: 19.99 },
        { id: 2, name: "Gadget", price: 24.99 },
      ],
      total: 44.98,
    },
    {
      apiResponse: {
        status: "success",
        data: {
          results: 42,
          filtered: true,
        },
        timestamp: "2023-07-15",
      },
    },
  ];

  // Format the current JSON sample as a string with proper indentation
  const currentJson = JSON.stringify(jsonSamples[jsonIndex], null, 2);

  useEffect(() => {
    setAnimate(true);

    // Start the typing animation cycle
    const animationCycle = setInterval(() => {
      if (typing) {
        setVisibleChars((prev) => {
          if (prev < currentJson.length) {
            return prev + 1;
          } else {
            setTyping(false);
            return prev;
          }
        });
      } else {
        setVisibleChars((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            setTyping(true);
            setJsonIndex((jsonIndex + 1) % jsonSamples.length);
            return 0;
          }
        });
      }
    }, 20);

    return () => clearInterval(animationCycle);
  }, [typing, jsonIndex, currentJson.length, jsonSamples.length]);

  // Display only the characters that should be visible
  const visibleJson = currentJson.substring(0, visibleChars);

  return (
    <div
      className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #7e22ce 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Subtle pattern overlay */}
      {/* <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-15 mix-blend-soft-light"></div> */}

      {/* Animated gradient overlay with inline animation */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(0, 0, 0, 0) 50%, rgba(168, 85, 247, 0.2) 100%)",
          animation: "moveGradient 8s ease infinite",
        }}
      ></div>

      {/* Using flex layout for better responsive positioning */}
      <div className="relative h-full flex flex-col justify-center items-center gap-6 px-8">
        {/* Slogan */}
        <div className="text-center">
          <h2
            className="text-3xl font-bold text-white mb-1"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
          >
            Visualize. Understand. Create.
          </h2>
          <p className="text-blue-100 text-lg">
            Transform raw JSON into beautiful visualizations
          </p>
        </div>

        {/* Terminal UI with JSON Animation */}
        <div className="w-full max-w-[500px] min-h-[300px] bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
          {/* Terminal Header with Lights */}
          <div className="h-8 bg-slate-800 flex items-center px-4 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <div className="ml-4 text-sm text-slate-400 font-mono">
              json-visualizer ~ terminal
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-4 min-h-[250px] max-h-[400px] overflow-auto">
            <div className="text-green-400 font-mono mb-2">
              $ visualize data.json
            </div>
            <pre className="text-blue-300 font-mono text-sm whitespace-pre">
              {visibleJson}
              <span className="animate-pulse">|</span>
            </pre>
          </div>
        </div>
      </div>

      {/* Enhanced glow effects with inline animations */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 opacity-20 blur-3xl"
        style={{ animation: "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
      ></div>
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-fuchsia-500 opacity-20 blur-3xl"
        style={{
          animation: "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDelay: "1.5s",
        }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-indigo-300 opacity-10 blur-3xl"
        style={{
          animation: "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          animationDelay: "0.7s",
        }}
      ></div>

      {/* Add CSS animations directly in the component */}
      <style jsx>{`
        @keyframes moveGradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
