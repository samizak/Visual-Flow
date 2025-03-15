import React, { useState } from "react";
import { useSupabase } from "../../../../components/Auth/SupabaseProvider";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  CreditCard,
  Moon,
  Sun,
  Star,
} from "lucide-react";
import { createClient } from "../../../../utils/superbase/client";
import SettingsDialog from "./SettingsDialog";
import { useJsonStore } from "../../../../store/useJsonStore";

import PanelToggle from "./HeaderComponents/PanelToggle";
import FileMenu from "./HeaderComponents/FileMenu";
import EditMenu from "./HeaderComponents/EditMenu";
import ViewMenu from "./HeaderComponents/ViewMenu";
import UpgradeModal from "../../../../components/PremiumFeatures/UpgradeModal";

export default function Header() {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string | undefined>(
    undefined
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // In your Header component
  const { user, isPro } = useSupabase();

  // Then in your JSX
  {
    /* Show Upgrade button if user is not authenticated or not a pro user */
  }
  {
    (!user || (user && !isPro)) && (
      <button
        className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer"
        onClick={() => {
          setCurrentFeature("");
          setUpgradeModalOpen(true);
        }}
      >
        <Star size={14} />
        <span>Upgrade to Pro</span>
      </button>
    );
  }
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { edgeType, setEdgeType, showGrid, setShowGrid } = useJsonStore();

  const handleUpgradeClick = (featureName?: string) => {
    setCurrentFeature(featureName);
    setUpgradeModalOpen(true);
  };

  const handleUpgrade = () => {
    window.location.href = "/pricing";
    setUpgradeModalOpen(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleEdgeStyleChange = (style: string) => {
    setEdgeType(style);
  };

  const handleToggleGrid = (show: boolean) => {
    setShowGrid(show);
  };

  return (
    <header className="bg-[#1e1e1e] border-b border-gray-700 py-1 px-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PanelToggle />

          <div className="h-5 w-px bg-gray-600 mx-0.5"></div>

          <div className="flex items-center space-x-1 pl-2">
            <FileMenu onUpgradeClick={handleUpgradeClick} />
            <EditMenu />
            <ViewMenu />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Only show Upgrade button if user is not authenticated */}
          {!user && (
            <button
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer"
              onClick={() => {
                setCurrentFeature("");
                setUpgradeModalOpen(true);
              }}
            >
              <Star size={14} />
              <span>Upgrade to Pro</span>
            </button>
          )}

          {/* Profile dropdown - different behavior based on auth state */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {user?.email ? (
                        user.email.substring(0, 2).toUpperCase()
                      ) : (
                        <User size={18} />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-800 border border-slate-700 text-white"
              >
                <div className="px-4 py-3 bg-slate-800">
                  <p className="text-sm font-medium text-white">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    {user.user_metadata?.name || "User"}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsSettingsOpen(true)}
                  className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/protected/billing")}
                  className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // In the sign-in button, update the onClick handler to include the current path
            <button
              onClick={() => {
                // Get the current path
                const currentPath = window.location.pathname;
                router.push(
                  `/auth/login?returnTo=${encodeURIComponent(currentPath)}`
                );
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded border border-slate-600 cursor-pointer shadow-sm transition-colors"
            >
              <User size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Add the upgrade modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
        featureName={currentFeature}
      />

      {/* Add the settings dialog */}
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        edgeStyle={edgeType}
        onEdgeStyleChange={handleEdgeStyleChange}
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
      />
    </header>
  );
}
