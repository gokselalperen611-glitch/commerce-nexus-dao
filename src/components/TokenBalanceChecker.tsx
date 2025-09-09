import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Search, Wallet } from 'lucide-react';
import { useTokenContract } from '@/hooks/useTokenContract';

interface TokenBalanceCheckerProps {
  contractAddress: string;
  tokenSymbol: string;
}

export const TokenBalanceChecker = ({ contractAddress, tokenSymbol }: TokenBalanceCheckerProps) => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getBalance } = useTokenContract(contractAddress);

  const handleCheckBalance = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);
      const balanceResult = await getBalance(address);
      setBalance(balanceResult);
    } catch (err) {
      console.error('Balance check error:', err);
      setError('Bakiye kontrolü başarısız. Geçerli bir adres girdiğinizden emin olun.');
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAddress('');
    setBalance(null);
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Bakiye Kontrol
        </CardTitle>
        <CardDescription>
          Herhangi bir cüzdan adresinin {tokenSymbol} bakiyesini kontrol edin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Cüzdan Adresi</Label>
          <div className="flex gap-2">
            <Input
              id="address"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCheckBalance}
              disabled={!address || loading}
              size="icon"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {balance !== null && !error && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {parseFloat(balance).toLocaleString()} {tokenSymbol}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Mevcut Bakiye
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                <strong>Adres:</strong> {address.slice(0, 8)}...{address.slice(-8)}
              </div>
            </div>
          </>
        )}

        {(balance !== null || error) && (
          <Button variant="outline" onClick={handleClear} className="w-full">
            Temizle
          </Button>
        )}
      </CardContent>
    </Card>
  );
};