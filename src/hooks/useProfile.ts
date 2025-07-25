import { useState, useEffect } from 'react';
import { supabase } from '../context/AuthContext';
import { UserProfile } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: user.id,
              email: user.email || '',
              full_name: '',
              is_approved: false,
              is_admin: false
            })
            .select()
            .single();

          if (createError) {
            setError(createError.message);
          } else {
            setProfile(newProfile);
          }
        } else {
          setError(error.message);
        }
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', profile?.user_id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { profile, isLoading, error, updateProfile, refetch: fetchProfile };
}