import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, ShoppingBag, ExternalLink } from 'lucide-react';

interface TokenRequiredMessageProps {
  storeName: string;
  tokenSymbol: string;
  feature: 'voting' | 'proposals' | 'governance';
  minTokens?: number;
}

export const TokenRequiredMessage = ({ 
  storeName, 
  tokenSymbol, 
  feature,
  minTokens 
}: TokenRequiredMessageProps) => {
  const getFeatureText = () => {
    switch (feature) {
      case 'voting':
        return 'vote on proposals';
      case 'proposals':
        return 'create proposals';
      case 'governance':
        return 'access governance features';
      default:
        return 'participate in governance';
    }
  };

  return (
    <Card className="p-8 bg-gradient-card border-border/50 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Token Holders Only</h3>
          <p className="text-muted-foreground max-w-md">
            Hold <Badge variant="secondary" className="mx-1">{tokenSymbol}</Badge> tokens to {getFeatureText()}.
            {minTokens && (
              <span className="block mt-2 text-sm">
                Minimum required: <strong>{minTokens.toLocaleString()} {tokenSymbol}</strong>
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="bg-gradient-primary">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Shop & Earn {tokenSymbol}
          </Button>
          <Button variant="outline" className="border-border/50">
            <ExternalLink className="w-4 h-4 mr-2" />
            Buy {tokenSymbol} Tokens
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-2">
          Governance rights are exclusive to {storeName} token holders
        </div>
      </div>
    </Card>
  );
};