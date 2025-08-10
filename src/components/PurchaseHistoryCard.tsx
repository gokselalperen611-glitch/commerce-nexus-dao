import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Coins, Calendar, Receipt, ExternalLink } from 'lucide-react';
import { usePurchaseHistory } from '@/hooks/usePurchaseHistory';
import { Store } from '@/types';

interface PurchaseHistoryProps {
  store: Store;
}

export const PurchaseHistoryCard = ({ store }: PurchaseHistoryProps) => {
  const { purchases, totalSpent, totalTokensEarned, loading } = usePurchaseHistory(store.id);

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted/50 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted/50 rounded"></div>
            <div className="h-4 bg-muted/50 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (purchases.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Henüz Alışveriş Yok</h3>
            <p className="text-muted-foreground text-sm">
              İlk alışverişinizi yaparak {store.tokenSymbol} token kazanmaya başlayın
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="space-y-6">
        {/* Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Alışveriş Geçmişi</h3>
            <Badge variant="outline" className="border-primary/50">
              {purchases.length} alışveriş
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Toplam Harcama</div>
              <div className="font-semibold text-lg">${totalSpent.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Kazanılan Token</div>
              <div className="font-semibold text-lg text-primary">
                {totalTokensEarned.toFixed(2)} {store.tokenSymbol}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Purchase List */}
        <div className="space-y-4">
          <h4 className="font-medium">Son Alışverişler</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {purchases.slice(0, 5).map((purchase) => (
              <div
                key={purchase.id}
                className="p-3 bg-muted/10 rounded-lg border border-muted/20"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Receipt className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">${purchase.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Coins className="w-3 h-3 text-primary" />
                      <span className="text-primary font-medium">
                        +{purchase.tokensEarned.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {purchase.items.slice(0, 3).join(', ')}
                    {purchase.items.length > 3 && ` +${purchase.items.length - 3} daha...`}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{purchase.date}</span>
                    </div>
                    {purchase.transactionHash && (
                      <code className="text-xs">{purchase.transactionHash.slice(0, 10)}...</code>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {purchases.length > 5 && (
            <Button variant="ghost" size="sm" className="w-full">
              Tümünü Görüntüle ({purchases.length - 5} daha)
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>

        {/* Rewards Info */}
        <Card className="p-4 bg-success/5 border-success/20">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-success" />
              <span className="font-medium text-success">Ödül Sistemi Aktif</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Her alışverişten sonra otomatik olarak {store.rewardRate}% oranında {store.tokenSymbol} token kazanırsınız.
              Bu tokenlar size yönetişim hakları verir ve kar paylaşımına katılmanızı sağlar.
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};