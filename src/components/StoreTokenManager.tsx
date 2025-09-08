import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Coins, ExternalLink, Settings, Users, TrendingUp } from 'lucide-react';
import { TokenDeploymentDialog } from './TokenDeploymentDialog';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TokenContract {
  id: string;
  contract_address: string;
  token_name: string;
  token_symbol: string;
  initial_supply: number;
  description: string;
  chain_id: number;
  deployed_at: string;
  is_active: boolean;
}

interface StoreTokenManagerProps {
  storeId: string;
  storeName: string;
}

export const StoreTokenManager = ({ storeId, storeName }: StoreTokenManagerProps) => {
  const [tokenContract, setTokenContract] = useState<TokenContract | null>(null);
  const [loading, setLoading] = useState(true);
  const { connected, address, chainId } = useWeb3Wallet();
  const { toast } = useToast();

  // Fetch existing token contract for this store
  useEffect(() => {
    const fetchTokenContract = async () => {
      try {
        const { data, error } = await supabase
          .from('token_contracts')
          .select('*')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching token contract:', error);
          return;
        }

        setTokenContract(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenContract();
  }, [storeId]);

  const handleTokenDeployment = async (contractAddress: string, tokenData: any) => {
    try {
      const { error } = await supabase
        .from('token_contracts')
        .insert({
          store_id: storeId,
          owner_id: address, // This should be the user ID, but using wallet address for now
          contract_address: contractAddress,
          token_name: tokenData.name,
          token_symbol: tokenData.symbol,
          initial_supply: tokenData.initialSupply,
          description: tokenData.description,
          chain_id: chainId || 137,
          deployed_at: tokenData.deployedAt
        });

      if (error) {
        throw error;
      }

      // Update store with contract address
      await supabase
        .from('stores')
        .update({
          contract_address: contractAddress,
          chain_id: chainId || 137
        })
        .eq('id', storeId);

      // Refresh token contract data
      const { data } = await supabase
        .from('token_contracts')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .single();

      setTokenContract(data);

      toast({
        title: "Token Kaydedildi! 🎉",
        description: `${tokenData.name} tokeni başarıyla kaydedildi.`
      });

    } catch (error: any) {
      console.error('Error saving token contract:', error);
      toast({
        title: "Kayıt Hatası",
        description: "Token bilgileri kaydedilemedi.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!tokenContract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Mağaza Tokeni
          </CardTitle>
          <CardDescription>
            {storeName} için özel token oluşturun ve müşterilerinizin sadakatini artırın.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Coins className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Token Oluşturun</h3>
              <p className="text-muted-foreground text-sm">
                Müşterileriniz alışveriş yaptıkça token kazansın ve yönetimde söz sahibi olsun.
              </p>
            </div>
          </div>

          {!connected ? (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Token oluşturmak için önce cüzdanınızı bağlayın.
              </p>
            </div>
          ) : (
            <TokenDeploymentDialog
              storeId={storeId}
              onSuccess={handleTokenDeployment}
            />
          )}
        </CardContent>
      </Card>
    );
  }

  const networkName = tokenContract.chain_id === 137 ? 'Polygon' : 
                     tokenContract.chain_id === 80001 ? 'Mumbai' : 
                     `Chain ${tokenContract.chain_id}`;

  const explorerUrl = tokenContract.chain_id === 137 
    ? `https://polygonscan.com/token/${tokenContract.contract_address}`
    : `https://mumbai.polygonscan.com/token/${tokenContract.contract_address}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            <div>
              <CardTitle>{tokenContract.token_name}</CardTitle>
              <CardDescription>{tokenContract.token_symbol}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-success/50 text-success">
            Aktif
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{tokenContract.initial_supply.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">İlk Arz</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Sahip Sayısı</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">$0.00</div>
            <div className="text-sm text-muted-foreground">Toplam Değer</div>
          </div>
        </div>

        <Separator />

        {/* Contract Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Kontrat Adresi</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {tokenContract.contract_address.slice(0, 8)}...{tokenContract.contract_address.slice(-6)}
              </code>
              <Button variant="ghost" size="sm" asChild>
                <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Ağ</span>
            <Badge variant="outline">{networkName}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Deploy Tarihi</span>
            <span className="text-sm">
              {new Date(tokenContract.deployed_at).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" disabled>
            <Users className="w-4 h-4 mr-2" />
            Sahipler
          </Button>
          <Button variant="outline" className="flex-1" disabled>
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" className="flex-1" disabled>
            <Settings className="w-4 h-4 mr-2" />
            Yönet
          </Button>
        </div>

        {tokenContract.description && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Açıklama</h4>
              <p className="text-sm text-muted-foreground">{tokenContract.description}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};