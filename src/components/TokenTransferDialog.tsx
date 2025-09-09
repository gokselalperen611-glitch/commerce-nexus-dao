import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Send, AlertTriangle } from 'lucide-react';
import { useTokenContract } from '@/hooks/useTokenContract';

interface TokenTransferDialogProps {
  contractAddress: string;
  tokenSymbol: string;
  userBalance: string;
  onSuccess?: () => void;
}

export const TokenTransferDialog = ({ contractAddress, tokenSymbol, userBalance, onSuccess }: TokenTransferDialogProps) => {
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { transfer, loading } = useTokenContract(contractAddress);

  const handleTransfer = async () => {
    if (!recipient || !amount) return;

    const success = await transfer(recipient, amount);
    if (success) {
      setRecipient('');
      setAmount('');
      setOpen(false);
      onSuccess?.();
    }
  };

  const handleMaxClick = () => {
    setAmount(userBalance);
  };

  const isAmountValid = parseFloat(amount || '0') <= parseFloat(userBalance);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Send className="w-4 h-4 mr-2" />
          Token Gönder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Token Gönder</DialogTitle>
          <DialogDescription>
            {tokenSymbol} tokenlarınızı başka bir adrese gönderin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
            <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Bakiye: {userBalance} {tokenSymbol}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Miktar ({tokenSymbol})</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                className="h-auto p-1 text-xs"
              >
                MAX
              </Button>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max={userBalance}
              step="any"
              className={!isAmountValid ? 'border-destructive' : ''}
            />
            {!isAmountValid && (
              <p className="text-sm text-destructive">
                Yetersiz bakiye
              </p>
            )}
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
              onClick={handleTransfer}
              disabled={!recipient || !amount || !isAmountValid || loading}
            >
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};