import { useState, useEffect } from 'react';

interface WalletState {
  connected: boolean;
  address: string | null;
  connecting: boolean;
  balance: number;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    connecting: false,
    balance: 0
  });

  const connectWallet = async () => {
    setWallet(prev => ({ ...prev, connecting: true }));
    
    // Simulate MetaMask connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAddress = `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`;
    const mockBalance = Math.floor(Math.random() * 10000) / 100; // 0-100 ETH
    
    setWallet({
      connected: true,
      address: mockAddress,
      connecting: false,
      balance: mockBalance
    });

    localStorage.setItem('wallet_connected', 'true');
    localStorage.setItem('wallet_address', mockAddress);
    localStorage.setItem('wallet_balance', mockBalance.toString());
  };

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      connecting: false,
      balance: 0
    });
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_balance');
  };

  // Restore wallet connection on page load
  useEffect(() => {
    const isConnected = localStorage.getItem('wallet_connected');
    const address = localStorage.getItem('wallet_address');
    const balance = localStorage.getItem('wallet_balance');

    if (isConnected && address && balance) {
      setWallet({
        connected: true,
        address,
        connecting: false,
        balance: parseFloat(balance)
      });
    }
  }, []);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet
  };
};