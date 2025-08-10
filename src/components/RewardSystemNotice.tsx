import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface RewardSystemNoticeProps {
  storeName: string;
  tokenSymbol: string;
}

export const RewardSystemNotice = ({ storeName, tokenSymbol }: RewardSystemNoticeProps) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">Store Reward System</h3>
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                <Clock className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Enhanced token rewards and loyalty programs for {storeName} customers
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Automated token distribution based on purchase amounts</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Tiered loyalty benefits for long-term {tokenSymbol} holders</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Special rewards for governance participation</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                We're currently working on a simulated reward system that will be available as an add-on feature.
              </div>
              <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};