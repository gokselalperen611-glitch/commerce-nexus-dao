import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, AlertTriangle } from 'lucide-react';
import { useTokenContract } from '@/hooks/useTokenContract';

interface TokenMintDialogProps {
  contractAddress: string;
  tokenSymbol: string;
  isOwner: boolean;
  onSuccess?: () => void;
}

export const TokenMintDialog = ({ contractAddress, tokenSymbol, isOwner, onSuccess }: TokenMintDialogProps) => {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { mint, loading } = useTokenContract(contractAddress);

  const handleMint = async () => {
    if (!recipient || !amount) return;

    const success = await mint(recipient, amount);
    if (success) {
      setRecipient('');
      setAmount('');
      setOpen(false);
      onSuccess?.();
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Token Mint Et
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Token Mint Et</DialogTitle>
          <DialogDescription>
            Yeni {tokenSymbol} tokenları oluşturun ve belirtilen adrese gönderin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950 dark:border-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Mint işlemi geri alınamaz. Lütfen dikkatli olun.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Alıcı Adresi</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Miktar ({tokenSymbol})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
            />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              className="flex-1"
              onClick={handleMint}
              disabled={!recipient || !amount || loading}
            >
              {loading ? 'Mint Ediliyor...' : 'Mint Et'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};