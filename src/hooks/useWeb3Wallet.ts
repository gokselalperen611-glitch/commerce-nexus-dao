import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

interface Web3WalletState {
  connected: boolean;
  address: string | null;
  connecting: boolean;
  balance: string;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

export const useWeb3Wallet = () => {
  const [wallet, setWallet] = useState<Web3WalletState>({
    connected: false,
    address: null,
    connecting: false,
    balance: '0',
    chainId: null,
    provider: null,
    signer: null
  });

  const connectWallet = async () => {
    try {
      setWallet(prev => ({ ...prev, connecting: true }));

      const provider = await detectEthereumProvider();
      if (!provider) {
        throw new Error('MetaMask not found. Please install MetaMask.');
      }

      const ethProvider = new ethers.BrowserProvider(provider as any);
      await ethProvider.send('eth_requestAccounts', []);
      
      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();
      const balance = await ethProvider.getBalance(address);
      const network = await ethProvider.getNetwork();

      setWallet({
        connected: true,
        address,
        connecting: false,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        provider: ethProvider,
        signer
      });

      // Store connection state
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', address);

    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setWallet(prev => ({ ...prev, connecting: false }));
      throw error;
    }
  };

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      connecting: false,
      balance: '0',
      chainId: null,
      provider: null,
      signer: null
    });
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
  };

  const switchToPolygon = async () => {
    if (!wallet.provider) return;

    try {
      await wallet.provider.send('wallet_switchEthereumChain', [
        { chainId: '0x89' } // Polygon mainnet
      ]);
    } catch (error: any) {
      if (error.code === 4902) {
        // Add Polygon network if not found
        await wallet.provider.send('wallet_addEthereumChain', [
          {
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com/']
          }
        ]);
      } else {
        throw error;
      }
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const initWallet = async () => {
      const wasConnected = localStorage.getItem('wallet_connected');
      if (wasConnected) {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
    };

    initWallet();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== wallet.address) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [wallet.address]);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
    switchToPolygon,
    isPolygon: wallet.chainId === 137,
    isTestnet: wallet.chainId === 80001
  };
};