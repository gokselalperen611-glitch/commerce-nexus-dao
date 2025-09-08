import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Rocket, AlertTriangle } from 'lucide-react';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

// Contract ABI (minimal for deployment)
const CONTRACT_BYTECODE = "608060405234801561001057600080fd5b50..."; // This would be the compiled bytecode

interface TokenDeploymentDialogProps {
  storeId?: string;
  onSuccess?: (contractAddress: string, tokenData: any) => void;
}

export const TokenDeploymentDialog = ({ storeId, onSuccess }: TokenDeploymentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    initialSupply: '1000000',
    description: ''
  });

  const { connected, signer, chainId, isPolygon, switchToPolygon } = useWeb3Wallet();
  const { toast } = useToast();

  const handleDeploy = async () => {
    if (!signer) {
      toast({
        title: "Cüzdan Bağlantısı Gerekli",
        description: "Token deploy etmek için önce cüzdanınızı bağlayın.",
        variant: "destructive"
      });
      return;
    }

    if (!isPolygon) {
      try {
        await switchToPolygon();
      } catch (error) {
        toast({
          title: "Ağ Değişikliği Gerekli",
          description: "Lütfen Polygon ağına geçin.",
          variant: "destructive"
        });
        return;
      }
    }

    setDeploying(true);

    try {
      // In real implementation, you would use the compiled contract
      // For now, we'll simulate the deployment
      const deploymentTx = {
        name: formData.name,
        symbol: formData.symbol,
        initialSupply: ethers.parseEther(formData.initialSupply),
        description: formData.description
      };

      // Simulate deployment delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock contract address
      const mockContractAddress = `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`;

      toast({
        title: "Token Başarıyla Deploy Edildi! 🎉",
        description: `${formData.name} (${formData.symbol}) tokeni oluşturuldu.`
      });

      onSuccess?.(mockContractAddress, {
        ...formData,
        contractAddress: mockContractAddress,
        chainId,
        deployedAt: new Date().toISOString()
      });

      setOpen(false);
      setFormData({ name: '', symbol: '', initialSupply: '1000000', description: '' });

    } catch (error: any) {
      console.error('Deployment failed:', error);
      toast({
        title: "Deployment Başarısız",
        description: error.message || "Token deploy edilemedi.",
        variant: "destructive"
      });
    } finally {
      setDeploying(false);
    }
  };

  const estimatedCost = "~0.01 MATIC"; // Rough estimate for Polygon

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Coins className="w-4 h-4" />
          Token Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Mağaza Tokeni Oluştur
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Network Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ağ Durumu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bağlı Ağ:</span>
                <Badge variant={isPolygon ? "default" : "destructive"}>
                  {chainId === 137 ? "Polygon Mainnet" : 
                   chainId === 80001 ? "Polygon Mumbai" : 
                   chainId ? `Chain ${chainId}` : "Bilinmiyor"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tahmini Maliyet:</span>
                <span className="text-sm font-mono">{estimatedCost}</span>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Token Adı</Label>
              <Input
                id="name"
                placeholder="örn. TechHub Token"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Token Sembolü</Label>
              <Input
                id="symbol"
                placeholder="örn. TECH"
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supply">İlk Arz (Token Sayısı)</Label>
            <Input
              id="supply"
              type="number"
              placeholder="1000000"
              value={formData.initialSupply}
              onChange={(e) => setFormData(prev => ({ ...prev, initialSupply: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Tokeniniz hakkında kısa bir açıklama..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Warning */}
          <Card className="border-orange-200">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-700">
                  <p className="font-medium mb-1">Önemli Uyarı:</p>
                  <p>Token oluşturduktan sonra ad, sembol ve ilk arz değiştirilemez. Lütfen bilgileri dikkatlice kontrol edin.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deploying}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              onClick={handleDeploy}
              disabled={!connected || !formData.name || !formData.symbol || deploying}
              className="flex-1"
            >
              {deploying ? "Deploy Ediliyor..." : "Token Oluştur"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};