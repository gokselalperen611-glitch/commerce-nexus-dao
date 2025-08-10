import { useState, useEffect } from 'react';

interface TokenBalance {
  balance: number;
  loading: boolean;
  canVote: boolean;
  canCreateProposal: boolean;
}

export const useTokenBalance = (storeId: string, minProposalTokens: number = 1000): TokenBalance => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock token balance - in real implementation, this would connect to wallet
    // and check on-chain balance for the specific store's token
    const mockBalance = Math.floor(Math.random() * 5000); // 0-5000 tokens
    
    setTimeout(() => {
      setBalance(mockBalance);
      setLoading(false);
    }, 1000);
  }, [storeId]);

  return {
    balance,
    loading,
    canVote: balance > 0,
    canCreateProposal: balance >= minProposalTokens
  };
};