"use client";

import { useState, useEffect } from 'react';
import { useSupabase } from '../../../components/Auth/SupabaseProvider';
import { ProtectedRoute } from '../../../components/Auth/ProtectedRoute';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { createClient } from '../../../utils/superbase/client';

export default function SettingsPage() {
  const { user, signOut } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
        setFullName(data.full_name || '');
      } catch (err: any) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);
  
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 rounded-full border-3 border-t-transparent border-blue-600 animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={updateProfile} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 bg-gray-100 dark:bg-slate-700 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              {message && (
                <div className={`p-4 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/10 text-green-700' 
                    : 'bg-red-50 dark:bg-red-900/10 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}
              
              <div className="flex justify-between">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                
                <Button
                  type="button"
                  onClick={signOut}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                >
                  Sign Out
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}