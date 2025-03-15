"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../../utils/superbase/client";
import { User, Session } from "@supabase/supabase-js";

type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isPro: boolean; // Add this
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  isPro: false, // Add this
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
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Add this useEffect to check subscription status
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (user) {
        try {
          console.log("Checking subscription for user:", user.id);
          
          // First, let's check what columns actually exist in the profiles table
          try {
            // Try to get the user's profile with minimal fields
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("id, email")
              .eq("id", user.id)
              .single();
            
            if (profileError) {
              // If profile doesn't exist, create it with minimal fields
              if (profileError.code === "PGRST116" || profileError.message.includes("no rows")) {
                console.log("Profile not found, creating new profile");
                
                // Create a minimal profile with only essential fields that we know exist
                const newProfile = {
                  id: user.id,
                  email: user.email || ''
                  // Don't include is_subscribed since it doesn't exist
                };
                
                console.log("Attempting to create profile with:", JSON.stringify(newProfile));
                
                const { error: insertError } = await supabase
                  .from("profiles")
                  .insert([newProfile]);
                
                if (insertError) {
                  console.error("Error creating profile details:", insertError.message);
                  console.error("Error code:", insertError.code);
                  setIsPro(false);
                  return;
                }
                
                console.log("Profile created successfully");
              } else {
                // Some other error occurred
                console.error("Error checking profile:", profileError.message);
                setIsPro(false);
                return;
              }
            } else {
              console.log("Profile found:", profileData);
              // For now, assume user is not pro since we can't check
              setIsPro(false);
              return;
            }
          } catch (err: any) {
            console.error("Exception in profile check:", err.message || err);
            setIsPro(false);
            return;
          }
          
          // If we get here, we've created a new profile
          // For now, assume user is not pro
          setIsPro(false);
          
        } catch (error: any) {
          console.error("Error in subscription check:", error.message || error);
          setIsPro(false);
        }
      } else {
        setIsPro(false);
      }
    };

    checkSubscriptionStatus();
  }, [user, supabase]);

  // Update the value object to include isPro
  const value = {
    user,
    session,
    isLoading,
    signOut,
    isPro, // Add this
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);
