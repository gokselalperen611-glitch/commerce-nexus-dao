import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Coins, 
  ShieldCheck, 
  ExternalLink, 
  Vote,
  DollarSign,
  BarChart3,
  Calendar,
  Trophy,
  Loader2,
  Sparkles,
  Package,
  Settings,
  History
} from 'lucide-react';
import { mockStores, mockProposals } from '../data/mockData';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { TokenRequiredMessage } from '../components/TokenRequiredMessage';
import { useWallet } from '../hooks/useWallet';
import { useStoreOwner } from '../hooks/useStoreOwner';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { WalletConnect } from '../components/WalletConnect';
import { CreateProposalDialog } from '../components/CreateProposalDialog';
import { TokenPurchaseDialog } from '../components/TokenPurchaseDialog';
import { RewardSystemNotice } from '../components/RewardSystemNotice';
import { PurchaseSimulator } from '../components/PurchaseSimulator';
import { PurchaseHistoryCard } from '../components/PurchaseHistoryCard';
import MetaverseScene from '../components/MetaverseScene';
import MetaverseBuilder from '../components/MetaverseBuilder';
import ProductGrid from '../components/ProductGrid';
import ProductManager from '../components/ProductManager';
import PurchaseHistory from '../components/PurchaseHistory';

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [realStore, setRealStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const store = mockStores.find(s => s.id === id);

  // Check if user owns this store
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRealStore();
    }
  }, [id]);

  const fetchRealStore = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setRealStore(data);
      
      // Check if current user owns this store
      if (user && data.owner_id === user.id) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!store && !realStore) {
    if (loading) {
      return (
        <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }
    
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Store Not Found</h2>
          <p className="text-muted-foreground">The store you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Use real store data if available, otherwise fallback to mock
  const displayStore = realStore || store;

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

  const storeProposals = mockProposals.filter(p => p.id <= '2'); // Mock proposals for this store
  const { balance, loading: tokenLoading, canVote, canCreateProposal, purchaseTokens } = useTokenBalance(id || store?.id || "1", 1000);
  const wallet = useWallet();
  const { checkOwnership } = useStoreOwner(wallet.address);
  const isStoreOwner = checkOwnership(id || store?.id || "1");

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {store.tokenSymbol[0]}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-3xl font-bold">{displayStore?.name || store?.name}</h1>
                    {(displayStore?.verified || store?.verified) && <ShieldCheck className="w-6 h-6 text-success" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{displayStore?.category || store?.category || "E-commerce"}</Badge>
                    <Badge variant="outline">Web3 DAO</Badge>
                    {isOwner && <Badge className="bg-gradient-primary">Sahibi</Badge>}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-lg mb-4">
                {displayStore?.description || store?.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Token: {displayStore?.token_symbol || store?.tokenSymbol}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>Reward Rate: {displayStore?.reward_rate ? (displayStore.reward_rate * 100).toFixed(0) : store?.rewardRate}%</span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-80">
              <Card className="p-6 bg-gradient-card border-border/50">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Token Price</div>
                    <div className="text-3xl font-bold text-gradient">{formatCurrency(store.tokenPrice)}</div>
                    <div className="text-sm text-success">+12.5% (24h)</div>
                  </div>
                  
                  <div className="space-y-2">
                    {store && (
                      <PurchaseSimulator 
                        store={store}
                        onTokensEarned={purchaseTokens}
                      />
                    )}
                    <TokenPurchaseDialog 
                      storeSymbol={displayStore?.token_symbol || store?.tokenSymbol || "TOKEN"}
                      onPurchase={async (amount) => {
                        purchaseTokens(amount);
                        return { success: true, error: null };
                      }}
                    />
                    <Button variant="outline" className="w-full border-border/50">
                      <Package className="w-4 h-4 mr-2" />
                      Ürünleri Görüntüle
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Token Holders</p>
                <p className="text-2xl font-bold">{formatNumber(store.holders)}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatNumber(store.monthlyRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Supply</p>
                <p className="text-2xl font-bold">{formatNumber(store.totalSupply)}</p>
              </div>
              <Coins className="w-8 h-8 text-accent" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reward Rate</p>
                <p className="text-2xl font-bold">{store.rewardRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
          </Card>
        </div>

        {/* Reward System Notice */}
        <div className="mb-8">
          <RewardSystemNotice storeName={store.name} tokenSymbol={store.tokenSymbol} />
        </div>

        {/* Wallet Connection */}
        {!wallet.connected && (
          <div className="mb-8">
            <WalletConnect />
          </div>
        )}

        {/* Tabs Content */}
        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="grid w-full grid-cols-7 bg-secondary/50">
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Ürünler
            </TabsTrigger>
            <TabsTrigger value="metaverse" className="bg-gradient-primary text-white border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Metaverse VR
            </TabsTrigger>
            <TabsTrigger value="governance">
              <Vote className="w-4 h-4 mr-2" />
              Yönetişim
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Geçmiş
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analitik
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="management">
                <Settings className="w-4 h-4 mr-2" />
                Yönetim
              </TabsTrigger>
            )}
            <TabsTrigger value="community">
              <Users className="w-4 h-4 mr-2" />
              Topluluk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Mağaza Ürünleri</h2>
                <p className="text-muted-foreground">
                  {displayStore?.name || store?.name} mağazasındaki ürünleri keşfedin ve satın alın
                </p>
              </div>
            </div>
            
            <ProductGrid 
              storeId={id || store?.id || "1"}
              storeName={displayStore?.name || store?.name || "Mağaza"}
              tokenSymbol={displayStore?.token_symbol || store?.tokenSymbol || "TOKEN"}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <PurchaseHistory 
              storeId={id || store?.id || "1"}
              storeName={displayStore?.name || store?.name || "Mağaza"}
              tokenSymbol={displayStore?.token_symbol || store?.tokenSymbol || "TOKEN"}
            />
          </TabsContent>

          {isOwner && (
            <TabsContent value="management" className="space-y-6">
              <ProductManager storeId={id || store?.id || "1"} />
            </TabsContent>
          )}

          <TabsContent value="governance" className="space-y-6">
            {tokenLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Checking token balance...</span>
              </div>
            ) : balance === 0 ? (
              <TokenRequiredMessage 
                storeName={displayStore?.name || store?.name || "Mağaza"}
                tokenSymbol={displayStore?.token_symbol || store?.tokenSymbol || "TOKEN"}
                feature="governance"
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Active Proposals</h2>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Your Balance: {balance.toLocaleString()} {store.tokenSymbol}</span>
                      <Badge variant={canVote ? "default" : "secondary"} className={canVote ? "bg-success" : ""}>
                        {canVote ? "Can Vote" : "Cannot Vote"}
                      </Badge>
                      {canCreateProposal && (
                        <Badge variant="outline" className="border-primary/50">
                          Can Create Proposals
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {wallet.connected && (
                      <WalletConnect variant="compact" />
                    )}
                    <CreateProposalDialog storeId={id || store?.id || "1"} onProposalCreated={() => {}} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {storeProposals.map((proposal) => (
                    <Card key={proposal.id} className="p-6 bg-gradient-card border-border/50">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{proposal.title}</h3>
                              <Badge 
                                variant={proposal.status === 'active' ? 'default' : 'secondary'}
                                className={proposal.status === 'active' ? 'bg-gradient-primary' : ''}
                              >
                                {proposal.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{proposal.description}</p>
                            <div className="text-sm text-muted-foreground">
                              Ends: {proposal.endDate} • Required: {proposal.requiredTokens} tokens
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>For: {proposal.votesFor}</span>
                            <span>Against: {proposal.votesAgainst}</span>
                          </div>
                          <Progress 
                            value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100} 
                            className="h-2"
                          />
                          <div className="text-sm text-muted-foreground">
                            {((proposal.votesFor + proposal.votesAgainst) / proposal.totalVotes * 100).toFixed(1)}% participation
                          </div>
                        </div>
                        
                        {proposal.status === 'active' && (
                          <div className="space-y-3 pt-2">
                            {canVote ? (
                              <div className="flex space-x-2">
                                <Button size="sm" className="bg-success">
                                  Vote For ({balance.toLocaleString()} votes)
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Vote Against ({balance.toLocaleString()} votes)
                                </Button>
                              </div>
                            ) : (
                              <div className="p-3 bg-muted/20 rounded-lg border border-muted/30">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">
                                    Hold {store.tokenSymbol} tokens to vote on this proposal
                                  </span>
                                  <Button size="sm" variant="outline" className="border-border/50">
                                    Get Tokens
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="metaverse" className="space-y-6">
            {isStoreOwner ? (
              <MetaverseBuilder 
                store={store}
                onSave={(config) => {
                  console.log('Metaverse config saved:', config);
                  // Here you would save the config to the database
                }}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      <Sparkles className="w-6 h-6 mr-2 text-primary" />
                      {store.name} Metaverse Mağazası
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Sanal gerçeklik ortamında ürünleri keşfedin
                    </p>
                  </div>
                </div>
                
                <Card className="p-6 bg-gradient-card border-border/50">
                  <MetaverseScene 
                    store={store}
                    onProductClick={(productId) => {
                      console.log('Product clicked:', productId);
                      // Handle product interaction
                    }}
                  />
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-gradient-card border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Metaverse Visitors</p>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-card border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">3D Products</p>
                        <p className="text-2xl font-bold">5</p>
                      </div>
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-gradient-card border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">VR Sales</p>
                        <p className="text-2xl font-bold">$2,150</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-success" />
                    </div>
                  </Card>
                </div>

                <Card className="p-6 bg-gradient-card border-border/50">
                  <h3 className="font-semibold mb-4">Metaverse Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">🌐 Virtual Reality Experience</h4>
                      <p className="text-sm text-muted-foreground">Navigate through a fully immersive 3D store environment</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">📦 Interactive Products</h4>
                      <p className="text-sm text-muted-foreground">Click and explore products in 3D space</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">🎨 Customizable Environment</h4>
                      <p className="text-sm text-muted-foreground">Store owners can customize their virtual space</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">💎 Token Integration</h4>
                      <p className="text-sm text-muted-foreground">Earn tokens for metaverse interactions</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Store Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-card border-border/50">
                <h3 className="font-semibold mb-4">Revenue Growth</h3>
                <div className="h-40 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="w-16 h-16" />
                  <span className="ml-4">Chart coming soon</span>
                </div>
              </Card>
              <Card className="p-6 bg-gradient-card border-border/50">
                <h3 className="font-semibold mb-4">Token Holder Growth</h3>
                <div className="h-40 flex items-center justify-center text-muted-foreground">
                  <TrendingUp className="w-16 h-16" />
                  <span className="ml-4">Chart coming soon</span>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tokenomics" className="space-y-6">
            <h2 className="text-2xl font-bold">Tokenomics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-card border-border/50">
                <h3 className="font-semibold mb-4">Token Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Public Sale</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <div className="flex justify-between">
                    <span>Team & Advisors</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <div className="flex justify-between">
                    <span>Treasury</span>
                    <span>15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <div className="flex justify-between">
                    <span>Rewards Pool</span>
                    <span>5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-card border-border/50">
                <h3 className="font-semibold mb-4">Token Utility</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Governance Rights</h4>
                    <p className="text-sm text-muted-foreground">Vote on business decisions</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Profit Sharing</h4>
                    <p className="text-sm text-muted-foreground">Receive quarterly dividends</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Exclusive Access</h4>
                    <p className="text-sm text-muted-foreground">Early access to new products</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Rewards Multiplier</h4>
                    <p className="text-sm text-muted-foreground">Enhanced purchase rewards</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Topluluk</h2>
                <Card className="p-6 bg-gradient-card border-border/50">
                  <h3 className="font-semibold mb-4">Topluluk İstatistikleri</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Toplam Üye</span>
                      <span className="font-semibold">{formatNumber(store.holders)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aktif Oylama Yapan</span>
                      <span className="font-semibold">{Math.floor(store.holders * 0.3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Öneri Başarı Oranı</span>
                      <span className="font-semibold text-success">78%</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-card border-border/50">
                  <h3 className="font-semibold mb-4">Son Aktiviteler</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>2 saat önce yeni öneri oluşturuldu</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>"Pazarlama Bütçesi" önerisi kabul edildi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Bu hafta 234 yeni token sahibi katıldı</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Alışveriş Geçmişiniz</h2>
                <PurchaseHistoryCard store={store} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StoreDetail;