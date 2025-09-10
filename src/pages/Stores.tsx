import { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import StoreCard from '../components/StoreCard';

const Stores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('created_at');
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All Categories', 'Technology', 'Fashion', 'Food & Beverage', 'Health', 'Entertainment'];

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          store_memberships!inner(id),
          products(id)
        `);

      if (error) throw error;

      // Transform data to match expected format
      const transformedStores = data.map(store => ({
        id: store.id,
        name: store.name,
        description: store.description || 'Bu mağaza henüz açıklama eklememiş.',
        tokenName: store.token_name,
        tokenSymbol: store.token_symbol,
        logoUrl: store.logo_url || '/placeholder.svg',
        holders: store.store_memberships?.length || 0,
        products: store.products?.length || 0,
        category: 'Technology', // Default category
        governanceScore: Math.floor(Math.random() * 100), // Mock data
        monthlyRevenue: Math.floor(Math.random() * 100000), // Mock data
        tokenPrice: Math.random() * 10, // Mock data
        created_at: store.created_at
      }));

      setStores(transformedStores);
    } catch (error: any) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores
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
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  const totalStores = stores.length;
  const totalHolders = stores.reduce((sum, store) => sum + store.holders, 0);
  const totalVolume = stores.reduce((sum, store) => sum + store.monthlyRevenue, 0);

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
                  <SelectItem value="created_at">En Yeni</SelectItem>
                  <SelectItem value="holders">En Çok Üye</SelectItem>
                  <SelectItem value="revenue">En Yüksek Gelir</SelectItem>
                  <SelectItem value="governance">En İyi Yönetişim</SelectItem>
                  <SelectItem value="price">Token Fiyatı</SelectItem>
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-32 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        ) : filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">Mağaza bulunamadı</h3>
            <p className="text-muted-foreground">
              Arama terimlerinizi veya filtrelerinizi değiştirmeyi deneyin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stores;