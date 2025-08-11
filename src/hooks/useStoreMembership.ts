import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface Store {
  id: string;
  name: string;
  description: string;
  token_name: string;
  token_symbol: string;
  membership_fee_tokens: number;
  has_premium_membership: boolean;
  premium_fee_tokens: number;
  premium_features: string[];
}

interface Membership {
  id: string;
  store_id: string;
  membership_type: 'basic' | 'premium';
  token_balance: number;
  is_active: boolean;
  joined_at: string;
}

export const useStoreMembership = (storeId: string) => {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storeId) {
      fetchStoreAndMembership();
    }
  }, [storeId, user]);

  const fetchStoreAndMembership = async () => {
    try {
      // Fetch store info
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (storeError) throw storeError;
      setStore(storeData);

      // Fetch membership if user is logged in
      if (user) {
        const { data: membershipData, error: membershipError } = await supabase
          .from('store_memberships')
          .select('*')
          .eq('store_id', storeId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (membershipError) throw membershipError;
        setMembership(membershipData as Membership | null);
      }
    } catch (error) {
      console.error('Error fetching store/membership:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinStore = async (membershipType: 'basic' | 'premium' = 'basic') => {
    if (!user || !store) return { success: false, error: 'Giriş yapılmamış veya mağaza bulunamadı' };

    const requiredTokens = membershipType === 'premium' 
      ? store.premium_fee_tokens 
      : store.membership_fee_tokens;

    try {
      const { error } = await supabase
        .from('store_memberships')
        .insert({
          user_id: user.id,
          store_id: storeId,
          membership_type: membershipType,
          token_balance: 0
        });

      if (error) throw error;

      await fetchStoreAndMembership();
      
      toast({
        title: "Topluluğa Katıldınız!",
        description: `${store.name} topluluğuna ${membershipType === 'premium' ? 'premium' : 'temel'} üye olarak katıldınız.`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const upgradeToPremium = async () => {
    if (!user || !store || !membership) return { success: false, error: 'Geçersiz durum' };

    try {
      const { error } = await supabase
        .from('store_memberships')
        .update({ membership_type: 'premium' })
        .eq('id', membership.id);

      if (error) throw error;

      await fetchStoreAndMembership();
      
      toast({
        title: "Premium Üyeliğe Yükseltildi!",
        description: `${store.name} topluluğunda artık premium üyesiniz.`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const purchaseTokens = async (amount: number) => {
    if (!membership) return { success: false, error: 'Üyelik bulunamadı' };

    try {
      const newBalance = membership.token_balance + amount;
      
      const { error } = await supabase
        .from('store_memberships')
        .update({ token_balance: newBalance })
        .eq('id', membership.id);

      if (error) throw error;

      setMembership(prev => prev ? { ...prev, token_balance: newBalance } : null);
      
      toast({
        title: "Token Satın Alındı!",
        description: `${amount} ${store?.token_symbol} token hesabınıza eklendi.`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const canVote = membership?.is_active && membership.token_balance > 0;
  const canCreateProposal = membership?.is_active && membership.token_balance >= 1000;
  const isMember = !!membership?.is_active;
  const isPremium = membership?.membership_type === 'premium';

  return {
    store,
    membership,
    loading,
    isMember,
    isPremium,
    canVote,
    canCreateProposal,
    joinStore,
    upgradeToPremium,
    purchaseTokens,
    refresh: fetchStoreAndMembership
  };
};