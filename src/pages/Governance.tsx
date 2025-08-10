import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Vote, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react';
import { mockStores, mockProposals } from '../data/mockData';
import { Link } from 'react-router-dom';

const Governance = () => {
  // Get all active proposals across all stores
  const activeProposals = mockProposals.filter(p => p.status === 'active');
  const totalProposals = mockProposals.length;
  const passedProposals = mockProposals.filter(p => p.status === 'passed').length;
  const participationRate = 73; // Mock participation rate

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Platform Governance</h1>
          <p className="text-muted-foreground text-lg">
            Participate in decentralized governance across all CommerceDAO stores
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Proposals</p>
                <p className="text-3xl font-bold">{activeProposals.length}</p>
              </div>
              <Vote className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold">{Math.round((passedProposals / totalProposals) * 100)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participation</p>
                <p className="text-3xl font-bold">{participationRate}%</p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Proposals</p>
                <p className="text-3xl font-bold">{totalProposals}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </Card>
        </div>

        {/* Active Proposals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Proposals Across Platform</h2>
            <Badge variant="outline" className="border-primary/50">
              {activeProposals.length} proposals need your vote
            </Badge>
          </div>

          <div className="space-y-6">
            {activeProposals.map((proposal) => {
              const store = mockStores.find(s => s.id === '1'); // Mock association
              return (
                <Card key={proposal.id} className="p-6 bg-gradient-card border-border/50">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{proposal.title}</h3>
                          <Badge variant="outline" className="border-blue-500/50 text-blue-500">
                            {proposal.type}
                          </Badge>
                          <Badge variant="default" className="bg-gradient-primary">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm text-muted-foreground">From:</span>
                          <Link 
                            to={`/store/${store?.id}`} 
                            className="text-primary hover:underline font-medium"
                          >
                            {store?.name}
                          </Link>
                          <Badge variant="secondary">{store?.tokenSymbol}</Badge>
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
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-muted-foreground">
                        Hold {store?.tokenSymbol} tokens to participate
                      </div>
                      <Link to={`/store/${store?.id}`}>
                        <Button size="sm" variant="outline" className="border-primary/30">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Store Directory for Governance */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Stores with Active Governance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStores.slice(0, 6).map((store) => (
              <Card key={store.id} className="p-6 bg-gradient-card border-border/50 hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {store.tokenSymbol[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{store.name}</h3>
                        <Badge variant="secondary">{store.tokenSymbol}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Governance Score</span>
                      <span className="font-medium">{store.governanceScore}/100</span>
                    </div>
                    <Progress value={store.governanceScore} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{store.holders.toLocaleString()} holders</span>
                      <span>2 active proposals</span>
                    </div>
                  </div>
                  
                  <Link to={`/store/${store.id}`}>
                    <Button className="w-full" variant="outline">
                      View Governance
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;