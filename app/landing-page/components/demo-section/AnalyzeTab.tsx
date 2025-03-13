import React from "react";
import CodeEditor from "../CodeEditor";
import FeatureDescription from "./FeatureDescription";
import { Sparkles, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface AnalyzeTabProps {
  sampleJson: any;
}

export default function AnalyzeTab({ sampleJson }: AnalyzeTabProps) {
  // You can replace sampleJson with this in your component props or create a local constant
  const inconsistentJson = {
    userId: 1001,
    user_name: "johndoe",
    firstName: "John",
    last_name: "Doe",
    contactInfo: {
      email_address: "john.doe@example.com",
      phoneNumber: "+1-555-123-4567",
      preferred_contact: "email",
    },
    account_settings: {
      darkMode: true,
      notification_preferences: {
        emailAlerts: true,
        push_notifications: false,
        weekly_digest: true,
      },
      privacySettings: {
        profile_visibility: "public",
        showEmail: false,
      },
    },
    lastLogin: "2023-04-15T08:30:45Z",
    created_at: "2022-11-03T14:20:10Z",
  };

  const analyzeFeatures = {
    title: "AI-Powered Analysis",
    description:
      "Visual Flow leverages advanced AI to analyze your JSON structure, identify patterns, predict data relationships, and provide intelligent recommendations for optimization and security.",
    features: [
      {
        text: "Intelligent Path Finder - Search for data using natural language queries",
      },
      {
        text: "Anomaly Detection - Identify outliers and inconsistencies in your data",
      },
      {
        text: "Security Scanning - Detect sensitive data and potential vulnerabilities",
      },
      {
        text: "Natural Language Insights - Get plain-English explanations of your data",
      },
    ],
  };

  // Mock AI insights for demonstration
  const aiInsights = [
    {
      type: "warning",
      message: "Found 8 instances of inconsistent naming (camelCase vs snake_case)",
    },
    {
      type: "success",
      message: "Data structure follows a consistent nesting pattern",
    },
    {
      type: "info",
      message: "Converting to consistent camelCase would reduce code complexity by 15%",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <FeatureDescription
          title={analyzeFeatures.title}
          description={analyzeFeatures.description}
          features={analyzeFeatures.features}
        />

        {/* AI Recommendation Callout */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex items-start gap-3">
          <div className="mt-1 text-indigo-400">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm text-indigo-300">
              Our AI analysis has identified inconsistent property naming
              conventions (camelCase vs snake_case) across your JSON structure.
              Implementing a standardized naming pattern would enhance code
              maintainability, improve developer experience, and facilitate more
              consistent data access patterns.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <CodeEditor code={inconsistentJson} />

        {/* AI Insights Section */}
        <div className="border-t border-slate-700 pt-4 mt-2">
          <h4 className="text-sm font-medium text-indigo-400 mb-2">
            AI Insights
          </h4>
          <div className="space-y-2">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className={`w-4 h-4 rounded-full bg-${
                    insight.type === "warning"
                      ? "yellow"
                      : insight.type === "success"
                      ? "green"
                      : "indigo"
                  }-500/20 flex items-center justify-center mt-0.5`}
                >
                  {insight.type === "warning" && (
                    <AlertTriangle size={10} className="text-yellow-500" />
                  )}
                  {insight.type === "success" && (
                    <CheckCircle size={10} className="text-green-500" />
                  )}
                  {insight.type === "info" && (
                    <Info size={10} className="text-indigo-500" />
                  )}
                </div>
                <p className="text-xs text-slate-400">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
