import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, TrendingUp, Users, Star } from 'lucide-react';
import { mockStores, categories } from '../data/mockData';
import StoreCard from '../components/StoreCard';

const Stores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('holders');

  const filteredStores = mockStores
    .filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          store.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          store.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || store.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'holders':
          return b.holders - a.holders;
        case 'revenue':
          return b.monthlyRevenue - a.monthlyRevenue;
        case 'governance':
          return b.governanceScore - a.governanceScore;
        case 'price':
          return b.tokenPrice - a.tokenPrice;
        default:
          return 0;
      }
    });

  const totalStores = mockStores.length;
  const totalHolders = mockStores.reduce((sum, store) => sum + store.holders, 0);
  const totalVolume = mockStores.reduce((sum, store) => sum + store.monthlyRevenue, 0);

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Discover <span className="text-gradient">Tokenized Stores</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore businesses that have embraced community ownership through tokenization. 
            Invest in your favorite brands and participate in their governance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stores</p>
                <p className="text-2xl font-bold text-foreground">{totalStores}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Token Holders</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalHolders.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Volume</p>
                <p className="text-2xl font-bold text-foreground">
                  ${(totalVolume / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8 bg-gradient-card border-border/50">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search stores, tokens, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="holders">Most Holders</SelectItem>
                  <SelectItem value="revenue">Highest Revenue</SelectItem>
                  <SelectItem value="governance">Best Governance</SelectItem>
                  <SelectItem value="price">Token Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active Filters */}
          <div className="flex items-center gap-2 mt-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategory !== 'All Categories' && (
              <Badge variant="secondary" className="text-xs">
                {selectedCategory}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                "{searchTerm}"
              </Badge>
            )}
          </div>
        </Card>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredStores.length} of {totalStores} stores
          </p>
          <Button variant="outline" size="sm" className="border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Store Grid */}
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No stores found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stores;