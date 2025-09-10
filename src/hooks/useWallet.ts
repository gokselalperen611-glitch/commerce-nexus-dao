import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface WalletState {
  connected: boolean;
  address: string | null;
  connecting: boolean;
  balance: string | null;
  chainId: number | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    address: null,
    connecting: false,
    balance: null,
    chainId: null,
  });

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask bulunamadı",
        description: "Lütfen MetaMask yükleyin.",
        variant: "destructive"
      });
      return;
    }

    try {
      setWalletState(prev => ({ ...prev, connecting: true }));

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });

        // Get chain ID
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        setWalletState({
          connected: true,
          address,
          connecting: false,
          balance: (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4),
          chainId: parseInt(chainId, 16),
        });

        localStorage.setItem('walletConnected', 'true');
        
        toast({
          title: "Cüzdan bağlandı",
          description: `Adres: ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
    } catch (error: any) {
      setWalletState(prev => ({ ...prev, connecting: false }));
      toast({
        title: "Bağlantı hatası",
        description: error.message || "Cüzdan bağlanırken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      connected: false,
      address: null,
      connecting: false,
      balance: null,
      chainId: null,
    });
    localStorage.removeItem('walletConnected');
    
    toast({
      title: "Cüzdan bağlantısı kesildi",
    });
  };

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected && typeof window.ethereum !== 'undefined') {
      connectWallet();
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== walletState.address) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [walletState.address]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
};