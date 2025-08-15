import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Coins,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Globe,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { mockStores } from '../data/mockData';
import StoreCard from '../components/StoreCard';

const Home = () => {
  const featuredStores = mockStores.slice(0, 3);

  const features = [
    {
      icon: ShoppingBag,
      title: 'Tokenize Your Store',
      description: 'Transform your e-commerce business into a community-owned DAO with custom tokens'
    },
    {
      icon: Users,
      title: 'Customer Governance',
      description: 'Let loyal customers participate in business decisions and share in your success'
    },
    {
      icon: Coins,
      title: 'Earn Rewards',
      description: 'Customers earn tokens for purchases and participate in profit sharing'
    },
    {
      icon: Shield,
      title: 'Verified Businesses',
      description: 'All stores undergo verification to ensure legitimacy and protect investors'
    },
    {
      icon: Sparkles,
      title: 'Metaverse Stores',
      description: 'Experience products in immersive 3D virtual reality environments'
    }
  ];

  const stats = [
    { label: 'Active Stores', value: '150+' },
    { label: 'Token Holders', value: '25K+' },
    { label: 'Total Volume', value: '$2.4M' },
    { label: 'Governance Votes', value: '1.2K' }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-hero opacity-10 rounded-3xl" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              The Future of E-commerce DAOs
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-gradient">Transform</span> Your Store Into a{' '}
              <span className="text-gradient">Community-Owned</span> DAO
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enable customers to own stakes in your business, participate in governance, 
              and share profits through blockchain-powered tokenization.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/launch">
                <Button size="lg" className="bg-gradient-primary text-lg px-8 py-3 glow-effect">
                  Launch Your Token
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/stores">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-primary/30 hover:bg-primary/10">
                  Explore Stores
                  <Globe className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-border/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How CommerceDAO Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A revolutionary platform that bridges traditional e-commerce with decentralized governance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-gradient-card border-border/50 text-center card-hover">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="py-20 px-6 bg-secondary/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Stores</h2>
              <p className="text-muted-foreground">
                Discover successful businesses that have tokenized with CommerceDAO
              </p>
            </div>
            <Link to="/stores">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                View All Stores
                <BarChart3 className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="p-12 bg-gradient-card border-border/50 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8">
                Join the future of commerce where customers become stakeholders and 
                businesses thrive through community ownership.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/launch">
                  <Button size="lg" className="bg-gradient-primary">
                    Launch Your Store Token
                    <Zap className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/stores">
                  <Button size="lg" variant="outline" className="border-primary/30">
                    Invest in Stores
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center mt-8 space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  No Setup Fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Multi-Platform Support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  24/7 Support
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;