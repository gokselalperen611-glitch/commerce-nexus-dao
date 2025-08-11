import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useStoreMembership } from '@/hooks/useStoreMembership';
import { useAuth } from '@/hooks/useAuth';
import { CreateProposalDialog } from '@/components/CreateProposalDialog';
import { TokenPurchaseDialog } from '@/components/TokenPurchaseDialog';
import { Calendar, Users, Vote, Crown, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposal_type: string;
  status: string;
  votes_for: number;
  votes_against: number;
  expires_at: string;
  created_at: string;
  creator_id: string;
  profiles?: {
    display_name: string;
  } | null;
}

export default function StoreGovernance() {
  const { id: storeId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { store, membership, loading, isMember, isPremium, canVote, canCreateProposal, joinStore, upgradeToPremium, purchaseTokens } = useStoreMembership(storeId!);
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (storeId && isMember) {
      fetchProposals();
      fetchMembers();
    }
  }, [storeId, isMember]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data?.map(p => ({
        ...p,
        profiles: null
      })) || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoadingProposals(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('store_memberships')
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleVote = async (proposalId: string, voteType: 'for' | 'against') => {
    if (!membership) return;

    try {
      const { error } = await supabase
        .from('governance_votes')
        .insert({
          proposal_id: proposalId,
          user_id: user!.id,
          vote_type: voteType,
          token_weight: membership.token_balance
        });

      if (error) throw error;
      await fetchProposals();
    } catch (error: any) {
      console.error('Error voting:', error);
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Süresi dolmuş';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} gün ${hours} saat kaldı`;
    return `${hours} saat kaldı`;
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;

  if (!store) return <div className="p-6">Mağaza bulunamadı</div>;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Giriş Yapın</h2>
            <p className="text-muted-foreground text-center">
              Mağaza topluluğuna erişim için giriş yapmalısınız.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{store.name} Topluluğu</CardTitle>
            <CardDescription>{store.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Coins className="h-5 w-5" />
                <span className="text-sm font-medium">Token: {store.token_name} ({store.token_symbol})</span>
              </div>
              
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Temel Üyelik</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Oylamalara katılın ve teklifler oluşturun
                  </p>
                  <p className="text-lg font-bold mb-3">
                    {store.membership_fee_tokens} {store.token_symbol}
                  </p>
                  <Button 
                    onClick={() => joinStore('basic')}
                    className="w-full"
                  >
                    Temel Üyelik Al
                  </Button>
                </div>

                {store.has_premium_membership && (
                  <div className="border rounded-lg p-4 border-primary">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Crown className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Premium Üyelik</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Özel özelliklere erişim + Temel üyelik avantajları
                    </p>
                    {store.premium_features.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium mb-2">Premium Özellikler:</p>
                        <div className="flex flex-wrap gap-1">
                          {store.premium_features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-lg font-bold mb-3">
                      {store.premium_fee_tokens} {store.token_symbol}
                    </p>
                    <Button 
                      onClick={() => joinStore('premium')}
                      className="w-full"
                      variant="default"
                    >
                      Premium Üyelik Al
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{store.name} Topluluğu</h1>
            <p className="text-muted-foreground">{store.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isPremium && <Badge variant="default"><Crown className="h-3 w-3 mr-1" />Premium</Badge>}
            <Badge variant="secondary">
              {membership?.token_balance || 0} {store.token_symbol}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center space-x-2 p-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-muted-foreground">Topluluk Üyesi</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-2 p-4">
              <Vote className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{proposals.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Aktif Teklif</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-2 p-4">
              <Coins className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{membership?.token_balance || 0}</p>
                <p className="text-sm text-muted-foreground">Token Bakiyeniz</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-2 mb-6">
          {canCreateProposal && <CreateProposalDialog storeId={storeId!} onProposalCreated={fetchProposals} />}
          <TokenPurchaseDialog 
            storeSymbol={store.token_symbol} 
            onPurchase={purchaseTokens}
          />
          {!isPremium && store.has_premium_membership && (
            <Button onClick={upgradeToPremium} variant="outline">
              <Crown className="h-4 w-4 mr-2" />
              Premium'a Yükselt
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="proposals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proposals">Teklifler</TabsTrigger>
          <TabsTrigger value="members">Üyeler</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          {loadingProposals ? (
            <div>Teklifler yükleniyor...</div>
          ) : proposals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Henüz teklif yok</p>
                <p className="text-muted-foreground">İlk teklifi siz oluşturun!</p>
              </CardContent>
            </Card>
          ) : (
            proposals.map((proposal) => {
              const totalVotes = proposal.votes_for + proposal.votes_against;
              const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;
              
              return (
                <Card key={proposal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{proposal.title}</CardTitle>
                        <Badge 
                          variant={proposal.status === 'active' ? 'default' : 'secondary'}
                        >
                          {proposal.status === 'active' ? 'Aktif' : 'Kapalı'}
                        </Badge>
                        <Badge variant="outline">{proposal.proposal_type}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatTimeRemaining(proposal.expires_at)}
                      </div>
                    </div>
                    <CardDescription>
                      Oluşturan: Topluluk Üyesi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{proposal.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Lehte: {proposal.votes_for}</span>
                        <span>Aleyhte: {proposal.votes_against}</span>
                      </div>
                      <Progress value={forPercentage} className="h-2" />
                      
                      {canVote && proposal.status === 'active' && (
                        <>
                          <Separator />
                          <div className="flex space-x-2">
                            <Button 
                              onClick={() => handleVote(proposal.id, 'for')}
                              size="sm"
                              className="flex-1"
                            >
                              Lehte Oy Ver
                            </Button>
                            <Button 
                              onClick={() => handleVote(proposal.id, 'against')}
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              Aleyhte Oy Ver
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {member.profiles?.display_name || 'Anonim Kullanıcı'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={member.membership_type === 'premium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {member.membership_type === 'premium' ? 'Premium' : 'Temel'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {member.token_balance} token
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}