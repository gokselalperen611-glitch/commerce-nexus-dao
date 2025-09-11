import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Package, DollarSign, Coins } from 'lucide-react';
import { PurchaseDialog } from './PurchaseDialog';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  dao_tokens_per_purchase: number;
  is_active: boolean;
}

interface ProductGridProps {
  storeId: string;
  storeName: string;
  tokenSymbol: string;
}

export default function ProductGrid({ storeId, storeName, tokenSymbol }: ProductGridProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = (product: Product) => {
    if (!user) {
      toast({
        title: "Giriş gerekli",
        description: "Satın alma işlemi için giriş yapmalısınız.",
        variant: "destructive"
      });
      return;
    }

    if (product.stock_quantity === 0) {
      toast({
        title: "Stok tükendi",
        description: "Bu ürün şu anda stokta bulunmuyor.",
        variant: "destructive"
      });
      return;
    }

    setSelectedProduct(product);
    setIsPurchaseDialogOpen(true);
  };

  const handlePurchaseComplete = () => {
    fetchProducts(); // Refresh products to update stock
    setIsPurchaseDialogOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="aspect-square bg-secondary rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-6 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded w-1/2"></div>
              <div className="h-4 bg-secondary rounded w-full"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Henüz ürün bulunmuyor</h3>
        <p className="text-muted-foreground">
          Bu mağaza henüz ürün eklememış. Daha sonra tekrar kontrol edin.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-card">
            <div className="relative">
              {product.image_url ? (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gradient-subtle flex items-center justify-center">
                  <Package className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute top-4 right-4">
                <Badge variant={product.stock_quantity > 0 ? "default" : "secondary"}>
                  {product.stock_quantity > 0 ? "Stokta" : "Tükendi"}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-5 h-5 text-success" />
                    <span className="text-xl font-bold">${product.price}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{product.stock_quantity} adet</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-3 bg-gradient-primary/10 rounded-lg border border-primary/20">
                  <Coins className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Satın alımda +{product.dao_tokens_per_purchase} {tokenSymbol} kazanın
                  </span>
                </div>
                
                <Button
                  onClick={() => handlePurchaseClick(product)}
                  disabled={product.stock_quantity === 0}
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock_quantity > 0 ? 'Satın Al' : 'Stokta Yok'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <PurchaseDialog
          isOpen={isPurchaseDialogOpen}
          onClose={() => setIsPurchaseDialogOpen(false)}
          product={selectedProduct}
          storeId={storeId}
          storeName={storeName}
          tokenSymbol={tokenSymbol}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </>
  );
}