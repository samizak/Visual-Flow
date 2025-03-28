"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createClient } from "@/utils/superbase/client";
import { User, Session } from "@supabase/supabase-js";

// Define the type only once and include refreshSubscription
type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isPro: boolean;
  refreshSubscription: () => Promise<void>; // Add this function to the type
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  isPro: false,
  refreshSubscription: async () => {}, // Add default implementation
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Extract the subscription check to a separate function and wrap in useCallback
  const checkSubscriptionStatus = useCallback(async () => {
    if (user) {
      try {
        // First check if the profile exists
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, is_subscribed, subscription_type")
          .eq("id", user.id);

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          setIsPro(false);
          return;
        }

        // Check if we have any profile data
        if (profileData && profileData.length > 0) {
          const profile = profileData[0]; // Get the first profile
          if (profile.is_subscribed === true) {
            setIsPro(true);
          } else {
            setIsPro(false);
          }
        } else {
          // console.log("No profile found for user:", user.id);
          setIsPro(false);
        }
      } catch (err) {
        console.error("Error checking subscription status:", err);
        setIsPro(false);
      }
    } else {
      setIsPro(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    } else {
      setIsPro(false);
    }
  }, [user, checkSubscriptionStatus]);

  const refreshSubscription = async () => {
    return checkSubscriptionStatus();
  };

  const value = {
    user,
    session,
    isLoading,
    isPro,
    signOut,
    refreshSubscription,
  };
  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);
