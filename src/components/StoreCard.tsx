import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store } from '../types';
import { TrendingUp, Users, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="bg-gradient-card p-6 border-border/50 card-hover group">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {store.tokenSymbol[0]}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {store.name}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {store.category}
                </Badge>
                <Badge variant="outline" className="text-xs border-accent/50 text-accent bg-accent/10">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Metaverse
                </Badge>
                {store.verified && (
                  <ShieldCheck className="w-4 h-4 text-success" />
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Token Price</div>
            <div className="font-semibold text-lg text-foreground">
              {formatCurrency(store.tokenPrice)}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {store.description}
        </p>

        <div className="grid grid-cols-3 gap-4 py-3 border-y border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs">Holders</span>
            </div>
            <div className="font-semibold text-sm">{formatNumber(store.holders)}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Revenue</span>
            </div>
            <div className="font-semibold text-sm">{formatNumber(store.monthlyRevenue)}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Rewards</div>
            <div className="font-semibold text-sm text-accent">{store.rewardRate}%</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link to={`/store/${store.id}`} className="flex-1">
            <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
              View Store
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Platform: {store.platform}</span>
          <span>Governance: {store.governanceScore}/100</span>
        </div>
      </div>
    </Card>
  );
};

export default StoreCard;