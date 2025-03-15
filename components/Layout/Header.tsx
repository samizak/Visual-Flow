import React, { useState } from "react";

import PanelToggle from "./HeaderComponents/PanelToggle";
import FileMenu from "./HeaderComponents/FileMenu";
import EditMenu from "./HeaderComponents/EditMenu";
import ViewMenu from "./HeaderComponents/ViewMenu";
import SettingsButton from "./HeaderComponents/SettingsButton";
import UpgradeModal from "../PremiumFeatures/UpgradeModal";

export default function Header() {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string | undefined>(
    undefined
  );

  const handleUpgradeClick = (featureName?: string) => {
    setCurrentFeature(featureName);
    setUpgradeModalOpen(true);
  };

  const handleUpgrade = () => {
    window.location.href = "/pricing";
    setUpgradeModalOpen(false);
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
          {/* Upgrade to Pro button */}
          <button
            className="flex items-center px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer"
            onClick={() => {
              setCurrentFeature("");
              setUpgradeModalOpen(true);
            }}
          >
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            Upgrade to Pro
          </button>

          <SettingsButton />
        </div>
      </div>

      {/* Add the upgrade modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
        featureName={currentFeature}
      />
    </header>
  );
}
