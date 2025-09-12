import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  TrendingUp, 
  ShoppingBag, 
  Vote,
  Users,
  Coins,
  DollarSign,
  History,
  Crown,
  ArrowUpRight,
  Loader2,
  Trophy,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalTokens: number;
  totalInvested: number;
  storeMemberships: number;
  totalPurchases: number;
  governanceVotes: number;
}

interface TokenHolding {
  store_name: string;
  token_symbol: string;
  token_balance: number;
  store_id: string;
  membership_type: string;
}

interface RecentPurchase {
  id: string;
  store_name: string;
  total_price: number;
  tokens_earned: number;
  purchase_date: string;
  status: string;
}

interface GovernanceActivity {
  proposal_title: string;
  vote_type: string;
  token_weight: number;
  created_at: string;
  store_name: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTokens: 0,
    totalInvested: 0,
    storeMemberships: 0,
    totalPurchases: 0,
    governanceVotes: 0
  });
  const [tokenHoldings, setTokenHoldings] = useState<TokenHolding[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [governanceActivity, setGovernanceActivity] = useState<GovernanceActivity[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch store memberships and token holdings
      const { data: memberships, error: membershipError } = await supabase
        .from('store_memberships')
        .select(`
          *,
          stores (name, token_symbol)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (membershipError) throw membershipError;

      // Process token holdings
      const holdings: TokenHolding[] = memberships?.map(membership => ({
        store_name: membership.stores.name,
        token_symbol: membership.stores.token_symbol,
        token_balance: membership.token_balance || 0,
        store_id: membership.store_id,
        membership_type: membership.membership_type
      })) || [];

      setTokenHoldings(holdings);

      // Fetch recent purchases
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select(`
          *,
          stores (name)
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false })
        .limit(5);

      if (purchasesError) throw purchasesError;

      const recentPurchasesData: RecentPurchase[] = purchases?.map(purchase => ({
        id: purchase.id,
        store_name: purchase.stores.name,
        total_price: purchase.total_price,
        tokens_earned: purchase.tokens_earned,
        purchase_date: purchase.purchase_date,
        status: purchase.status
      })) || [];

      setRecentPurchases(recentPurchasesData);

      // Fetch governance votes
      const { data: votes, error: votesError } = await supabase
        .from('governance_votes')
        .select(`
          *,
          governance_proposals (
            title,
            stores (name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (votesError) throw votesError;

      const governanceData: GovernanceActivity[] = votes?.map(vote => ({
        proposal_title: vote.governance_proposals.title,
        vote_type: vote.vote_type,
        token_weight: vote.token_weight,
        created_at: vote.created_at,
        store_name: vote.governance_proposals.stores.name
      })) || [];

      setGovernanceActivity(governanceData);

      // Calculate stats
      const totalTokens = holdings.reduce((sum, holding) => sum + holding.token_balance, 0);
      const totalInvested = recentPurchasesData.reduce((sum, purchase) => sum + parseFloat(purchase.total_price.toString()), 0);
      
      setStats({
        totalTokens,
        totalInvested,
        storeMemberships: holdings.length,
        totalPurchases: recentPurchasesData.length,
        governanceVotes: governanceData.length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Dashboard'a Erişim</h2>
          <p className="text-muted-foreground mb-6">
            Dashboard'ınızı görüntülemek için giriş yapmanız gerekiyor.
          </p>
          <Link to="/auth">
            <Button className="bg-gradient-primary">
              Giriş Yap
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Hoş geldin, {user.user_metadata?.display_name || user.email?.split('@')[0]}!
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-8 h-8 text-primary" />
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Token</p>
              <p className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-success" />
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Yatırım</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalInvested)}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Üyelikler</p>
              <p className="text-2xl font-bold">{stats.storeMemberships}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-8 h-8 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alışveriş</p>
              <p className="text-2xl font-bold">{stats.totalPurchases}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <Vote className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Oylar</p>
              <p className="text-2xl font-bold">{stats.governanceVotes}</p>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="holdings" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
            <TabsTrigger value="holdings">
              <Coins className="w-4 h-4 mr-2" />
              Token Portföyü
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Alışverişler
            </TabsTrigger>
            <TabsTrigger value="governance">
              <Vote className="w-4 h-4 mr-2" />
              Governance
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analitik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="holdings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Token Portföyünüz</h2>
                <p className="text-muted-foreground">
                  Sahip olduğunuz mağaza tokenları ve üyelik durumlarınız
                </p>
              </div>
            </div>

            {tokenHoldings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokenHoldings.map((holding, index) => (
                  <Card key={index} className="p-6 bg-gradient-card border-border/50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{holding.store_name}</h3>
                        <p className="text-sm text-muted-foreground">{holding.token_symbol}</p>
                      </div>
                      <Badge 
                        variant={holding.membership_type === 'premium' ? 'default' : 'secondary'}
                        className={holding.membership_type === 'premium' ? 'bg-gradient-primary' : ''}
                      >
                        {holding.membership_type === 'premium' ? (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </>
                        ) : 'Temel'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Token Bakiye</span>
                          <span className="font-medium">{holding.token_balance.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-border/50">
                        <Link to={`/store/${holding.store_id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Mağazayı Ziyaret Et
                            <ArrowUpRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-gradient-card border-border/50">
                <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Henüz Token Sahibi Değilsiniz</h3>
                <p className="text-muted-foreground mb-6">
                  Mağazalardan alışveriş yaparak veya token satın alarak portföyünüzü oluşturabilirsiniz.
                </p>
                <Link to="/stores">
                  <Button className="bg-gradient-primary">
                    Mağazaları Keşfet
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Son Alışverişleriniz</h2>
                <p className="text-muted-foreground">
                  Yaptığınız alışverişler ve kazandığınız tokenlar
                </p>
              </div>
            </div>

            {recentPurchases.length > 0 ? (
              <div className="space-y-4">
                {recentPurchases.map((purchase) => (
                  <Card key={purchase.id} className="p-6 bg-gradient-card border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{purchase.store_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(purchase.purchase_date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(purchase.total_price)}</div>
                        <div className="text-sm text-success">
                          +{purchase.tokens_earned} token kazandınız
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-gradient-card border-border/50">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Henüz Alışveriş Yapmadınız</h3>
                <p className="text-muted-foreground mb-6">
                  Mağazalardan alışveriş yaparak token kazanmaya başlayın.
                </p>
                <Link to="/stores">
                  <Button className="bg-gradient-primary">
                    Alışverişe Başla
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Governance Aktiviteleriniz</h2>
                <p className="text-muted-foreground">
                  Verdiğiniz oylar ve katıldığınız yönetişim kararları
                </p>
              </div>
            </div>

            {governanceActivity.length > 0 ? (
              <div className="space-y-4">
                {governanceActivity.map((activity, index) => (
                  <Card key={index} className="p-6 bg-gradient-card border-border/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.vote_type === 'for' ? 'bg-success/20' : 'bg-destructive/20'
                        }`}>
                          <Vote className={`w-5 h-5 ${
                            activity.vote_type === 'for' ? 'text-success' : 'text-destructive'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{activity.proposal_title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {activity.store_name} • {formatDate(activity.created_at)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge 
                              variant={activity.vote_type === 'for' ? 'default' : 'destructive'}
                              className={activity.vote_type === 'for' ? 'bg-success' : ''}
                            >
                              {activity.vote_type === 'for' ? 'Destekledi' : 'Karşı Çıktı'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {activity.token_weight} token ile
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-gradient-card border-border/50">
                <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Henüz Governance Aktiviteniz Yok</h3>
                <p className="text-muted-foreground mb-6">
                  Token sahibi olduğunuz mağazalarda proposal'lara oy vererek yönetişime katılın.
                </p>
                <Link to="/governance">
                  <Button className="bg-gradient-primary">
                    Governance'ı Keşfet
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-8 bg-gradient-card border-border/50 text-center">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Analitik Özellikleri</h3>
              <p className="text-muted-foreground mb-6">
                Detaylı portföy analitiği ve performans raporları yakında eklenecek.
              </p>
              <Button variant="outline" disabled>
                Yakında Gelecek
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;