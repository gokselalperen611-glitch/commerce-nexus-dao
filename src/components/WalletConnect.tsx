import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Wallet, Loader2, LogOut, Copy } from 'lucide-react';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  variant?: 'default' | 'compact';
}

export const WalletConnect = ({ variant = 'default' }: WalletConnectProps) => {
  const { connected, address, connecting, balance, connectWallet, disconnectWallet, chainId, isPolygon } = useWeb3Wallet();
  const { toast } = useToast();

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (variant === 'compact') {
    if (connected && address) {
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-success/50 text-success">
            Connected
          </Badge>
          <Button variant="ghost" size="sm" onClick={copyAddress}>
            {formatAddress(address)}
            <Copy className="w-3 h-3 ml-1" />
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnectWallet}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return (
      <Button onClick={connectWallet} disabled={connecting} size="sm">
        {connecting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4 mr-2" />
        )}
        Connect Wallet
      </Button>
    );
  }

  if (connected && address) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Wallet Connected</h3>
            <Badge variant="outline" className="border-success/50 text-success">
              Connected
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Address</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                  {formatAddress(address)}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Balance</label>
              <div className="font-semibold">{parseFloat(balance).toFixed(4)} {isPolygon ? 'MATIC' : 'ETH'}</div>
            </div>
            
            {chainId && (
              <div>
                <label className="text-sm text-muted-foreground">Network</label>
                <div className="text-sm">
                  {chainId === 137 ? 'Polygon Mainnet' : 
                   chainId === 80001 ? 'Mumbai Testnet' : 
                   `Chain ${chainId}`}
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" onClick={disconnectWallet} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Connect Your Wallet</h3>
          <p className="text-muted-foreground text-sm">
            Connect MetaMask to participate in governance and earn rewards
          </p>
        </div>

        <Button onClick={connectWallet} disabled={connecting} className="w-full bg-gradient-primary">
          {connecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting to MetaMask...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect MetaMask
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};