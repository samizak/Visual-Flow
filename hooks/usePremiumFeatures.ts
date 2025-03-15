import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '../components/Auth/SupabaseProvider'; // Add this import

export function usePremiumFeatures(isPremiumUser: boolean = false) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { user } = useSupabase(); // Get the current user from Supabase context

  const openUpgradeModal = useCallback((featureName?: string) => {
    setCurrentFeature(featureName);
    setUpgradeModalOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setUpgradeModalOpen(false);
  }, []);

  const handleUpgrade = useCallback(() => {
    // Check if user is authenticated
    if (!user) {
      // If not authenticated, redirect to login page with a return URL
      router.push(`/auth/login?returnTo=${encodeURIComponent('/pricing')}`);
    } else {
      // If authenticated, navigate to pricing page
      router.push('/pricing');
    }
    setUpgradeModalOpen(false);
  }, [router, user]);

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