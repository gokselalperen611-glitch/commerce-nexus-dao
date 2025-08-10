import { useState, useEffect } from 'react';

export interface Purchase {
  id: string;
  storeId: string;
  amount: number;
  tokensEarned: number;
  date: string;
  items: string[];
  transactionHash?: string;
}

interface PurchaseHistory {
  purchases: Purchase[];
  totalSpent: number;
  totalTokensEarned: number;
}

export const usePurchaseHistory = (storeId: string) => {
  const [history, setHistory] = useState<PurchaseHistory>({
    purchases: [],
    totalSpent: 0,
    totalTokensEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load purchase history from localStorage
    const savedHistory = localStorage.getItem(`purchase_history_${storeId}`);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      // Generate some mock purchase history
      const mockPurchases: Purchase[] = [
        {
          id: '1',
          storeId,
          amount: 125.50,
          tokensEarned: 62.75,
          date: '2024-01-15',
          items: ['Premium Coffee Blend', 'Coffee Mug'],
          transactionHash: '0x123...abc'
        },
        {
          id: '2',
          storeId,
          amount: 89.99,
          tokensEarned: 44.99,
          date: '2024-01-10',
          items: ['Espresso Machine Accessories'],
          transactionHash: '0x456...def'
        }
      ];

      const totalSpent = mockPurchases.reduce((sum, p) => sum + p.amount, 0);
      const totalTokensEarned = mockPurchases.reduce((sum, p) => sum + p.tokensEarned, 0);

      const initialHistory = {
        purchases: mockPurchases,
        totalSpent,
        totalTokensEarned
      };

      setHistory(initialHistory);
      localStorage.setItem(`purchase_history_${storeId}`, JSON.stringify(initialHistory));
    }
    setLoading(false);
  }, [storeId]);

  const addPurchase = (purchase: Omit<Purchase, 'id' | 'date' | 'transactionHash'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`
    };

    const updatedHistory = {
      purchases: [newPurchase, ...history.purchases],
      totalSpent: history.totalSpent + newPurchase.amount,
      totalTokensEarned: history.totalTokensEarned + newPurchase.tokensEarned
    };

    setHistory(updatedHistory);
    localStorage.setItem(`purchase_history_${storeId}`, JSON.stringify(updatedHistory));

    return newPurchase;
  };

  return {
    ...history,
    loading,
    addPurchase
  };
};