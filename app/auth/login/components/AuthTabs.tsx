"use client";

// Update the AuthTabsProps interface to match the actual type
interface AuthTabsProps {
  activeTab: "signin" | "signup";
  setActiveTab: (tab: "signin" | "signup") => void;
}

export function AuthTabs({ activeTab, setActiveTab }: AuthTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab("signin")}
          className={`pb-2 font-medium text-sm cursor-pointer ${
            activeTab === "signin"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`pb-2 font-medium text-sm cursor-pointer ${
            activeTab === "signup"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Create account
        </button>
      </div>
    </div>
  );
}