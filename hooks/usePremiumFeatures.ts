import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function usePremiumFeatures(isPremiumUser: boolean = false) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string | undefined>(undefined);
  const router = useRouter();

  const openUpgradeModal = useCallback((featureName?: string) => {
    setCurrentFeature(featureName);
    setUpgradeModalOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModalOpen(false);
  }, []);

  const handleUpgrade = useCallback(() => {
    // Navigate to pricing or subscription page
    router.push('/pricing');
    setUpgradeModalOpen(false);
  }, [router]);

  // Function to wrap premium feature handlers
  const wrapPremiumFeature = useCallback(
    (handler: () => void, featureName: string) => {
      return () => {
        if (isPremiumUser) {
          handler();
        } else {
          openUpgradeModal(featureName);
        }
      };
    },
    [isPremiumUser, openUpgradeModal]
  );

  return {
    isPremiumUser,
    upgradeModalOpen,
    currentFeature,
    openUpgradeModal,
    closeUpgradeModal,
    handleUpgrade,
    wrapPremiumFeature,
  };
}