"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "../../utils/superbase/client";
import { User, Session, RealtimeChannel } from "@supabase/supabase-js";

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
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, is_subscribed, subscription_type")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          setIsPro(false);
          return;
        }

        if (profileData && profileData.is_subscribed === true) {
          setIsPro(true);
        } else {
          setIsPro(false);
        }
      } catch (err) {
        console.error("Error checking subscription status:", err);
        setIsPro(false);
      }
    } else {
      // No user, so definitely not pro
      setIsPro(false);
    }
  }, [user, supabase]); // Add dependencies that the function uses

  // Add this useEffect to check subscription status
  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    } else {
      setIsPro(false);
    }
  }, [user, checkSubscriptionStatus]);

  // Add a function to manually refresh the subscription status
  // Keep the refreshSubscription function
  const refreshSubscription = async () => {
    // console.log("Manually refreshing subscription status");
    return checkSubscriptionStatus();
  };

  return (
    <SupabaseContext.Provider
      value={{
        user,
        session,
        isLoading,
        isPro,
        signOut,
        refreshSubscription, // This is now properly typed
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

// Remove the duplicate type declaration here
export const useSupabase = () => useContext(SupabaseContext);
