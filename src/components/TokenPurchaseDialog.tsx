import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Coins, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TokenPurchaseDialogProps {
  storeSymbol: string;
  onPurchase: (amount: number) => Promise<{ success: boolean; error: any }>;
}

export const TokenPurchaseDialog = ({ storeSymbol, onPurchase }: TokenPurchaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const tokenAmount = parseFloat(amount) || 0;

  const handlePurchase = async () => {
    if (tokenAmount <= 0) return;

    setIsProcessing(true);
    
    const { success, error } = await onPurchase(tokenAmount);
    
    if (success) {
      setOpen(false);
      setAmount('');
    } else {
      toast({
        title: "Satın Alma Hatası",
        description: error || "Token satın alırken bir hata oluştu",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Coins className="w-4 h-4 mr-2" />
          {storeSymbol} Token Satın Al
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="w-5 h-5" />
            <span>{storeSymbol} Token Satın Al</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* Purchase Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Satın Alınacak Miktar</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Token miktarını girin"
                  className="pr-20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  {storeSymbol}
                </div>
              </div>
            </div>

            {tokenAmount > 0 && (
              <Card className="p-4 bg-muted/20 border-muted/30">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Token Miktarı</span>
                    <span className="font-medium">{tokenAmount.toLocaleString()} {storeSymbol}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Toplam Tutar</span>
                    <span className="font-medium">0.01 ETH</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Purchase Button */}
          <div className="space-y-3">
            <Button 
              onClick={handlePurchase} 
              disabled={tokenAmount <= 0 || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  Token Satın Al
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
              İptal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};