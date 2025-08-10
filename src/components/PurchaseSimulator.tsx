import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Coins, Receipt, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Store } from '@/types';
import { usePurchaseHistory } from '@/hooks/usePurchaseHistory';

interface PurchaseSimulatorProps {
  store: Store;
  onTokensEarned: (amount: number) => void;
}

export const PurchaseSimulator = ({ store, onTokensEarned }: PurchaseSimulatorProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastPurchase, setLastPurchase] = useState<any>(null);
  const { toast } = useToast();
  const { addPurchase } = usePurchaseHistory(store.id);

  const purchaseAmount = parseFloat(amount) || 0;
  const tokensToEarn = purchaseAmount * (store.rewardRate / 100);
  const rewardPercentage = store.rewardRate;

  const handlePurchase = async () => {
    if (purchaseAmount <= 0 || !items.trim()) return;

    setIsProcessing(true);
    
    // Simulate purchase processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const itemList = items.split(',').map(item => item.trim()).filter(item => item);
    
    const purchase = addPurchase({
      storeId: store.id,
      amount: purchaseAmount,
      tokensEarned: tokensToEarn,
      items: itemList
    });

    setLastPurchase(purchase);
    onTokensEarned(tokensToEarn);
    setIsProcessing(false);
    setShowSuccess(true);

    toast({
      title: "Alışveriş Tamamlandı! 🎉",
      description: `${tokensToEarn.toFixed(2)} ${store.tokenSymbol} token kazandınız!`,
    });

    // Reset form after showing success
    setTimeout(() => {
      setAmount('');
      setItems('');
      setShowSuccess(false);
      setOpen(false);
    }, 3000);
  };

  if (showSuccess && lastPurchase) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-primary">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Alışveriş Simülasyonu
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Alışveriş Başarılı!</h3>
              <p className="text-muted-foreground">Token kazancınız hesabınıza eklendi</p>
            </div>

            <Card className="p-4 bg-gradient-card border-border/50">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Harcama</span>
                  <span className="font-medium">${lastPurchase.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Kazanılan Token</span>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="font-bold text-primary">
                      +{lastPurchase.tokensEarned.toFixed(2)} {store.tokenSymbol}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ödül Oranı</span>
                  <Badge variant="outline" className="border-success/50 text-success">
                    {rewardPercentage}%
                  </Badge>
                </div>
              </div>
            </Card>

            <div className="text-xs text-muted-foreground">
              Otomatik olarak kapanacak...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-primary">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Alışveriş Simülasyonu
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <span>{store.name}'den Alışveriş</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Store Info */}
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Token Ödül Oranı</span>
                <Badge variant="outline" className="border-success/50 text-success">
                  {rewardPercentage}% = {rewardPercentage/100} token/$1
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Her $1 harcama için {rewardPercentage/100} {store.tokenSymbol} token kazanırsınız
              </div>
            </div>
          </Card>

          {/* Purchase Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Alışveriş Tutarı ($)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="items">Ürünler (virgülle ayırın)</Label>
              <Input
                id="items"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="Kahve, Kurabiye, Çanta"
              />
            </div>

            {purchaseAmount > 0 && (
              <Card className="p-4 bg-muted/20 border-muted/30">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Toplam Tutar</span>
                    <span className="font-medium">${purchaseAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center space-x-1">
                      <Coins className="w-3 h-3 text-primary" />
                      <span>Kazanacağınız Token</span>
                    </span>
                    <span className="font-bold text-primary">
                      +{tokensToEarn.toFixed(2)} {store.tokenSymbol}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Bu tokenlar yönetişim haklarınızı artırır
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Purchase Button */}
          <div className="space-y-3">
            <Button 
              onClick={handlePurchase} 
              disabled={purchaseAmount <= 0 || !items.trim() || isProcessing}
              className="w-full bg-gradient-primary"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4 mr-2" />
                  ${purchaseAmount.toFixed(2)} Alışveriş Yap
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