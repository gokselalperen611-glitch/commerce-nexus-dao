import { useState, useEffect } from 'react';

interface StoreOwnerData {
  isOwner: boolean;
  ownedStores: string[];
  loading: boolean;
}

export const useStoreOwner = (walletAddress: string | null) => {
  const [data, setData] = useState<StoreOwnerData>({
    isOwner: false,
    ownedStores: [],
    loading: true
  });

  useEffect(() => {
    if (!walletAddress) {
      setData({ isOwner: false, ownedStores: [], loading: false });
      return;
    }

    // Simulate checking if wallet owns any stores
    setTimeout(() => {
      // Mock: 30% chance of being a store owner
      const isOwner = Math.random() < 0.3;
      const ownedStores = isOwner ? ['1', '2'] : []; // Mock owned store IDs

      setData({
        isOwner,
        ownedStores,
        loading: false
      });
    }, 1000);
  }, [walletAddress]);

  const checkOwnership = (storeId: string): boolean => {
    return data.ownedStores.includes(storeId);
  };

  return {
    ...data,
    checkOwnership
  };
};