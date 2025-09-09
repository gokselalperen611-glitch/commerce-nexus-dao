import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Wallet } from './useWeb3Wallet';
import { useToast } from './use-toast';

// ERC20 Token ABI - sadece gerekli fonksiyonlar
const TOKEN_ABI = [
  // ERC20 Standard Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Custom Functions
  "function mint(address to, uint256 amount)",
  "function pause()",
  "function unpause()",
  "function paused() view returns (bool)",
  "function owner() view returns (address)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  balance: string;
  isOwner: boolean;
  isPaused: boolean;
}

export const useTokenContract = (contractAddress?: string) => {
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const { signer, address: userAddress, connected } = useWeb3Wallet();
  const { toast } = useToast();

  const getContract = () => {
    if (!contractAddress || !signer) {
      throw new Error('Contract address or signer not available');
    }
    return new ethers.Contract(contractAddress, TOKEN_ABI, signer);
  };

  const fetchTokenInfo = async (): Promise<TokenInfo | null> => {
    if (!contractAddress || !signer || !userAddress) return null;

    try {
      setLoading(true);
      const contract = getContract();
      
      const [name, symbol, decimals, totalSupply, balance, owner, isPaused] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
        contract.balanceOf(userAddress),
        contract.owner(),
        contract.paused()
      ]);

      const info: TokenInfo = {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        balance: ethers.formatUnits(balance, decimals),
        isOwner: owner.toLowerCase() === userAddress.toLowerCase(),
        isPaused
      };

      setTokenInfo(info);
      return info;
    } catch (error) {
      console.error('Error fetching token info:', error);
      toast({
        title: "Hata",
        description: "Token bilgileri alınamadı",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async (address: string): Promise<string> => {
    if (!contractAddress || !signer) {
      throw new Error('Contract not available');
    }

    try {
      const contract = getContract();
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  };

  const transfer = async (to: string, amount: string): Promise<boolean> => {
    if (!connected || !signer) {
      toast({
        title: "Cüzdan Bağlı Değil",
        description: "İşlem için cüzdanınızı bağlayın",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);
      const contract = getContract();
      const decimals = await contract.decimals();
      const amountWei = ethers.parseUnits(amount, decimals);
      
      const tx = await contract.transfer(to, amountWei);
      
      toast({
        title: "İşlem Gönderildi",
        description: "Transfer işlemi blockchain'e gönderildi",
      });

      await tx.wait();
      
      toast({
        title: "Transfer Başarılı! 🎉",
        description: `${amount} token başarıyla gönderildi`,
      });

      // Refresh token info
      await fetchTokenInfo();
      return true;
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast({
        title: "Transfer Hatası",
        description: error.reason || "Transfer işlemi başarısız",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const mint = async (to: string, amount: string): Promise<boolean> => {
    if (!connected || !signer) {
      toast({
        title: "Cüzdan Bağlı Değil",
        description: "İşlem için cüzdanınızı bağlayın",
        variant: "destructive"
      });
      return false;
    }

    if (!tokenInfo?.isOwner) {
      toast({
        title: "Yetki Hatası",
        description: "Sadece token sahibi mint yapabilir",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);
      const contract = getContract();
      const decimals = await contract.decimals();
      const amountWei = ethers.parseUnits(amount, decimals);
      
      const tx = await contract.mint(to, amountWei);
      
      toast({
        title: "İşlem Gönderildi",
        description: "Mint işlemi blockchain'e gönderildi",
      });

      await tx.wait();
      
      toast({
        title: "Mint Başarılı! 🎉",
        description: `${amount} token başarıyla mint edildi`,
      });

      // Refresh token info
      await fetchTokenInfo();
      return true;
    } catch (error: any) {
      console.error('Mint error:', error);
      toast({
        title: "Mint Hatası",
        description: error.reason || "Mint işlemi başarısız",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const pauseToken = async (): Promise<boolean> => {
    if (!connected || !signer) {
      toast({
        title: "Cüzdan Bağlı Değil",
        description: "İşlem için cüzdanınızı bağlayın",
        variant: "destructive"
      });
      return false;
    }

    if (!tokenInfo?.isOwner) {
      toast({
        title: "Yetki Hatası",
        description: "Sadece token sahibi pause yapabilir",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);
      const contract = getContract();
      
      const tx = tokenInfo.isPaused 
        ? await contract.unpause()
        : await contract.pause();
      
      toast({
        title: "İşlem Gönderildi",
        description: `Token ${tokenInfo.isPaused ? 'aktif' : 'durdurma'} işlemi gönderildi`,
      });

      await tx.wait();
      
      toast({
        title: "İşlem Başarılı! 🎉",
        description: `Token ${tokenInfo.isPaused ? 'aktifleştirildi' : 'durduruldu'}`,
      });

      // Refresh token info
      await fetchTokenInfo();
      return true;
    } catch (error: any) {
      console.error('Pause/Unpause error:', error);
      toast({
        title: "İşlem Hatası",
        description: error.reason || "İşlem başarısız",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    tokenInfo,
    loading,
    fetchTokenInfo,
    getBalance,
    transfer,
    mint,
    pauseToken,
    connected
  };
};