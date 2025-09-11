import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, DollarSign, Coins, Package, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  dao_tokens_per_purchase: number;
}

interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  storeId: string;
  storeName: string;
  tokenSymbol: string;
  onPurchaseComplete: () => void;
}

export function PurchaseDialog({
  isOpen,
  onClose,
  product,
  storeId,
  storeName,
  tokenSymbol,
  onPurchaseComplete
}: PurchaseDialogProps) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);

  const totalPrice = product.price * quantity;
  const totalTokens = product.dao_tokens_per_purchase * quantity;

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    if (num > 0 && num <= product.stock_quantity) {
      setQuantity(num);
    }
  };

  const handlePurchase = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          store_id: storeId,
          product_id: product.id,
          quantity,
          total_price: totalPrice,
          status: 'completed'
        });

      if (purchaseError) throw purchaseError;

      // Update product stock
      const { error: stockError } = await supabase
        .from('products')
        .update({
          stock_quantity: product.stock_quantity - quantity
        })
        .eq('id', product.id);

      if (stockError) throw stockError;

      setIsPurchaseComplete(true);
      
      toast({
        title: "Satın alma başarılı!",
        description: `${quantity}x ${product.name} satın aldınız ve ${totalTokens} ${tokenSymbol} token kazandınız.`,
      });

      setTimeout(() => {
        onPurchaseComplete();
        onClose();
        setIsPurchaseComplete(false);
        setQuantity(1);
      }, 2000);

    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Satın alma hatası",
        description: error.message || "Satın alma işleminde hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !isPurchaseComplete) {
      onClose();
      setQuantity(1);
      setIsPurchaseComplete(false);
    }
  };

  if (isPurchaseComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Satın Alma Başarılı!</h3>
            <p className="text-muted-foreground mb-4">
              {quantity}x {product.name} satın aldınız
            </p>
            <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center">
                <Coins className="w-5 h-5 mr-2 text-primary" />
                <span className="font-semibold text-primary">
                  +{totalTokens} {tokenSymbol} Token Kazandınız!
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Satın Al - {product.name}
          </DialogTitle>
          <DialogDescription>
            {storeName} mağazasından satın alma işleminizi tamamlayın
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="flex space-x-4">
              {product.image_url ? (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-semibold">{product.name}</h4>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-semibold">${product.price}</span>
                  </div>
                  <Badge variant="outline">
                    {product.stock_quantity} stokta
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Quantity Selection */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Miktar</Label>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange((quantity - 1).toString())}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="text-center"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange((quantity + 1).toString())}
                disabled={quantity >= product.stock_quantity}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Maksimum {product.stock_quantity} adet satın alabilirsiniz
            </p>
          </div>

          {/* Purchase Summary */}
          <Card className="p-4 bg-gradient-subtle border-border/50">
            <h4 className="font-semibold mb-3">Satın Alma Özeti</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Birim fiyat:</span>
                <span>${product.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Miktar:</span>
                <span>{quantity}x</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Toplam fiyat:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Coins className="w-4 h-4 mr-1 text-primary" />
                    <span>Kazanılacak Token:</span>
                  </div>
                  <span className="font-semibold text-primary">
                    +{totalTokens} {tokenSymbol}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4 bg-gradient-card border-border/50">
            <h4 className="font-semibold mb-2">Ödeme Yöntemi</h4>
            <Badge className="bg-gradient-primary">
              Demo Ödeme (Ücretsiz Test)
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Bu demo ortamında gerçek ödeme yapılmaz
            </p>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            İptal
          </Button>
          <Button onClick={handlePurchase} disabled={loading} className="bg-gradient-primary">
            {loading ? "İşleniyor..." : `${totalPrice.toFixed(2)}$ Öde`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}