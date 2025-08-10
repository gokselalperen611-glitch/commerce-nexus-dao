export interface Store {
  id: string;
  name: string;
  description: string;
  category: string;
  tokenSymbol: string;
  tokenName: string;
  tokenPrice: number;
  totalSupply: number;
  holders: number;
  monthlyRevenue: number;
  rewardRate: number;
  governanceScore: number;
  imageUrl: string;
  verified: boolean;
  launchDate: string;
  platform: 'Shopify' | 'WooCommerce' | 'BigCommerce' | 'Custom';
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'operations' | 'financial';
  status: 'active' | 'passed' | 'rejected';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endDate: string;
  requiredTokens: number;
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  participationRate: number;
  successRate: number;
}