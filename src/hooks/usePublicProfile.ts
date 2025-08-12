import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PublicProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const usePublicProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const fetchPublicProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Safely select only public profile fields (excluding wallet_address)
        const { data, error } = await supabase
          .from('profiles')
          .select('id, user_id, display_name, avatar_url, created_at, updated_at')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;

        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching public profile:', err);
        setError(err.message || 'Profil yüklenirken hata oluştu');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  return { profile, loading, error };
};