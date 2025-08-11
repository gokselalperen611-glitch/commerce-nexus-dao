import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Vote, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CreateProposalDialogProps {
  storeId: string;
  onProposalCreated: () => void;
}

export const CreateProposalDialog = ({ storeId, onProposalCreated }: CreateProposalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature' as 'feature' | 'policy' | 'tokenomics' | 'governance',
    votingPeriod: 7
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) return;

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + formData.votingPeriod);

      const { error } = await supabase
        .from('governance_proposals')
        .insert({
          store_id: storeId,
          creator_id: user.id,
          title: formData.title,
          description: formData.description,
          proposal_type: formData.type,
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      toast({
        title: "Teklif Oluşturuldu",
        description: `"${formData.title}" topluluk oylaması için sunuldu`,
      });

      setOpen(false);
      setFormData({
        title: '',
        description: '',
        type: 'feature',
        votingPeriod: 7
      });
      onProposalCreated();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Teklif oluşturulurken bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'policy': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'tokenomics': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'governance': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Teklif Oluştur
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Vote className="w-5 h-5" />
            <span>Yeni Teklif Oluştur</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Teklif Başlığı</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="örn., Yeni özellik ekle: Mobil uygulama"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Teklifin detaylı açıklaması, beklenen sonuçlar ve gerekçeler..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Teklif Türü</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'feature' | 'policy' | 'tokenomics' | 'governance') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Özellik</SelectItem>
                    <SelectItem value="policy">Politika</SelectItem>
                    <SelectItem value="tokenomics">Tokenomics</SelectItem>
                    <SelectItem value="governance">Yönetim</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="votingPeriod" className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Oylama Süresi (gün)</span>
                </Label>
                <Select
                  value={formData.votingPeriod.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, votingPeriod: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 gün</SelectItem>
                    <SelectItem value="7">7 gün</SelectItem>
                    <SelectItem value="14">14 gün</SelectItem>
                    <SelectItem value="30">30 gün</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Oluşturuluyor...' : 'Teklif Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};