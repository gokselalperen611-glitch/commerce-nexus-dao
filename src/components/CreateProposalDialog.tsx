import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Vote, Plus, Calendar, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Store } from '@/types';

interface CreateProposalDialogProps {
  store: Store;
  isOwner: boolean;
}

export const CreateProposalDialog = ({ store, isOwner }: CreateProposalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'product' as 'product' | 'operations' | 'financial',
    requiredTokens: 1,
    votingPeriod: 7
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate proposal creation
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Proposal Created",
      description: `"${formData.title}" has been submitted for community voting`,
    });

    setOpen(false);
    setFormData({
      title: '',
      description: '',
      type: 'product',
      requiredTokens: 1,
      votingPeriod: 7
    });
    setIsSubmitting(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'operations': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'financial': return 'bg-green-500/10 text-green-500 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  if (!isOwner) {
    return (
      <Card className="p-4 bg-muted/20 border-muted/30">
        <div className="text-center text-sm text-muted-foreground">
          Store owners only can create proposals
        </div>
      </Card>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Proposal
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Vote className="w-5 h-5" />
            <span>Create New Proposal for {store.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Add new product line: Eco-friendly packaging"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed explanation of the proposal, expected outcomes, and rationale..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Proposal Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'product' | 'operations' | 'financial') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getTypeColor('product')}>Product</Badge>
                        <span>New products, changes</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="operations">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getTypeColor('operations')}>Operations</Badge>
                        <span>Business operations</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="financial">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getTypeColor('financial')}>Financial</Badge>
                        <span>Budget, profits</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredTokens" className="flex items-center space-x-1">
                  <Coins className="w-4 h-4" />
                  <span>Min. Tokens to Vote</span>
                </Label>
                <Input
                  id="requiredTokens"
                  type="number"
                  min="1"
                  value={formData.requiredTokens}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiredTokens: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="votingPeriod" className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Voting Period (days)</span>
                </Label>
                <Select
                  value={formData.votingPeriod.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, votingPeriod: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <Card className="p-4 bg-gradient-card border-border/50">
            <h4 className="font-medium mb-3">Proposal Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h5 className="font-medium">{formData.title || 'Untitled Proposal'}</h5>
                <Badge variant="outline" className={getTypeColor(formData.type)}>
                  {formData.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.description || 'No description provided'}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>Min. {formData.requiredTokens} {store.tokenSymbol} to vote</span>
                <span>Voting period: {formData.votingPeriod} days</span>
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary">
              {isSubmitting ? 'Creating...' : 'Create Proposal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};