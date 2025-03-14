import React from 'react';
import { Button } from '../ui/button';
import { Lock } from 'lucide-react';

interface PremiumFeatureWrapperProps {
  children: React.ReactNode;
  isPremiumUser: boolean;
  featureName: string;
  onUpgradeClick?: () => void;
  showAsButton?: boolean;
}

export default function PremiumFeatureWrapper({
  children,
  isPremiumUser,
  featureName,
  onUpgradeClick,
  showAsButton = false
}: PremiumFeatureWrapperProps) {
  // If user is premium, render the children normally
  if (isPremiumUser) {
    return <>{children}</>;
  }

  // For free users, show a locked version
  if (showAsButton) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="text-gray-400 hover:text-gray-300 cursor-not-allowed flex items-center gap-1 opacity-70"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onUpgradeClick) onUpgradeClick();
        }}
      >
        <Lock className="h-3 w-3" />
        {featureName}
      </Button>
    );
  }

  // For menu items or other elements
  return (
    <div
      className="text-gray-400 hover:text-gray-300 cursor-not-allowed flex items-center gap-1 opacity-70"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onUpgradeClick) onUpgradeClick();
      }}
    >
      <Lock className="h-3 w-3" />
      <span>{featureName}</span>
    </div>
  );
}