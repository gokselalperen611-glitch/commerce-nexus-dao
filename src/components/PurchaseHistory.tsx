import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingBag, Calendar, DollarSign, Coins, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Purchase {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  tokens_earned: number;
  status: string;
  purchase_date: string;
  products: {
    name: string;
    image_url: string;
  };
}

interface PurchaseHistoryProps {
  storeId: string;
  storeName: string;
  tokenSymbol: string;
}

export default function PurchaseHistory({ storeId, storeName, tokenSymbol }: PurchaseHistoryProps) {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    totalTokensEarned: 0
  });

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user, storeId]);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          products (
            name,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('store_id', storeId)
        .order('purchase_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      setPurchases(data || []);
      
      // Calculate stats
      const totalPurchases = data?.length || 0;
      const totalSpent = data?.reduce((sum, purchase) => sum + purchase.total_price, 0) || 0;
      const totalTokensEarned = data?.reduce((sum, purchase) => sum + purchase.tokens_earned, 0) || 0;
      
      setStats({ totalPurchases, totalSpent, totalTokensEarned });
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Alışveriş Geçmişi</h3>
        <p className="text-muted-foreground">
          Alışveriş geçmişinizi görüntülemek için giriş yapın
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-secondary rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Alışveriş</p>
              <p className="text-2xl font-bold">{stats.totalPurchases}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Harcama</p>
              <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-success" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Kazanılan Token</p>
              <p className="text-2xl font-bold">{stats.totalTokensEarned}</p>
            </div>
            <Coins className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Purchase History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Alışveriş Geçmişi</h3>
            <p className="text-muted-foreground">{storeName} mağazasındaki alışverişleriniz</p>
          </div>
          <Button variant="outline" onClick={fetchPurchases}>
            Yenile
          </Button>
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-semibold mb-2">Henüz alışveriş yok</h4>
            <p className="text-muted-foreground">
              Bu mağazadan ilk alışverişinizi yaparak token kazanmaya başlayın!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="p-4 border-border/50 bg-gradient-subtle">
                <div className="flex items-center space-x-4">
                  {purchase.products?.image_url ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={purchase.products.image_url}
                        alt={purchase.products.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{purchase.products?.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDistanceToNow(new Date(purchase.purchase_date), { addSuffix: true })}</span>
                          </div>
                          <div>Miktar: {purchase.quantity}x</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold">${purchase.total_price.toFixed(2)}</div>
                        <div className="flex items-center text-sm text-primary">
                          <Coins className="w-4 h-4 mr-1" />
                          <span>+{purchase.tokens_earned} {tokenSymbol}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                        {purchase.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}