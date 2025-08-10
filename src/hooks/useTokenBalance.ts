import { useState, useEffect } from 'react';

interface TokenBalance {
  balance: number;
  loading: boolean;
  canVote: boolean;
  canCreateProposal: boolean;
}

export const useTokenBalance = (storeId: string, minProposalTokens: number = 1000): TokenBalance & {
  purchaseTokens: (amount: number) => void;
} => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing balance in localStorage
    const savedBalance = localStorage.getItem(`token_balance_${storeId}`);
    const initialBalance = savedBalance ? parseFloat(savedBalance) : Math.floor(Math.random() * 5000);
    
    setTimeout(() => {
      setBalance(initialBalance);
      setLoading(false);
      if (!savedBalance) {
        localStorage.setItem(`token_balance_${storeId}`, initialBalance.toString());
      }
    }, 1000);
  }, [storeId]);

  const purchaseTokens = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    localStorage.setItem(`token_balance_${storeId}`, newBalance.toString());
  };

  return {
    balance,
    loading,
    canVote: balance > 0,
    canCreateProposal: balance >= minProposalTokens,
    purchaseTokens
  };
};