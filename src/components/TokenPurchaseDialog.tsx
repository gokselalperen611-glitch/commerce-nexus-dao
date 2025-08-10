import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Coins, Wallet, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Store } from '@/types';

interface TokenPurchaseDialogProps {
  store: Store;
  walletConnected: boolean;
  onPurchaseComplete: (amount: number) => void;
}

export const TokenPurchaseDialog = ({ store, walletConnected, onPurchaseComplete }: TokenPurchaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const tokenAmount = parseFloat(amount) || 0;
  const totalCost = tokenAmount * store.tokenPrice;
  const estimatedRewards = tokenAmount * (store.rewardRate / 100);

  const handlePurchase = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase tokens",
        variant: "destructive"
      });
      return;
    }

    if (tokenAmount <= 0) return;

    setIsProcessing(true);
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    toast({
      title: "Purchase Successful!",
      description: `You have purchased ${tokenAmount.toLocaleString()} ${store.tokenSymbol} tokens`,
    });

    onPurchaseComplete(tokenAmount);
    setOpen(false);
    setAmount('');
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-primary">
          <Coins className="w-4 h-4 mr-2" />
          Buy {store.tokenSymbol} Tokens
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="w-5 h-5" />
            <span>Purchase {store.tokenSymbol}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Token Info */}
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Token Price</span>
                <span className="font-semibold">${store.tokenPrice.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reward Rate</span>
                <Badge variant="outline" className="border-success/50 text-success">
                  {store.rewardRate}% per purchase
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Supply</span>
                <span className="text-sm">{store.totalSupply.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Purchase Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Purchase</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter token amount"
                  className="pr-20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  {store.tokenSymbol}
                </div>
              </div>
            </div>

            {tokenAmount > 0 && (
              <Card className="p-4 bg-muted/20 border-muted/30">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Token Amount</span>
                    <span className="font-medium">{tokenAmount.toLocaleString()} {store.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Total Cost</span>
                    <span className="font-medium">${totalCost.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Est. Future Rewards</span>
                    </span>
                    <span className="font-medium text-success">
                      {estimatedRewards.toFixed(2)}% boost
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Purchase Button */}
          <div className="space-y-3">
            {!walletConnected ? (
              <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-warning">
                  <Wallet className="w-4 h-4" />
                  <span>Connect your wallet to purchase tokens</span>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handlePurchase} 
                disabled={tokenAmount <= 0 || isProcessing}
                className="w-full bg-gradient-primary"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Transaction...
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    Purchase for ${totalCost.toFixed(4)}
                  </>
                )}
              </Button>
            )}
            
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};