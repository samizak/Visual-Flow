import { useState, useEffect } from 'react';
import { useSupabase } from '../components/Auth/SupabaseProvider';
import { createClient } from '../utils/superbase/client';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: any;
  created_at: string;
  updated_at?: string;
}

export function useProfile() {
  const { user } = useSupabase();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (fetchError) {
          throw fetchError;
        }
        
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [user]);
  
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };
    
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      setProfile(data);
      return { data };
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    profile,
    loading,
    error,
    updateProfile
  };
}