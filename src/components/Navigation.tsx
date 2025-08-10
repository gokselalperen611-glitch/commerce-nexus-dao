import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, BarChart3, Vote, Plus, Wallet } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: ShoppingBag },
    { path: '/stores', label: 'Stores', icon: BarChart3 },
    { path: '/governance', label: 'Governance', icon: Vote },
    { path: '/launch', label: 'Launch Token', icon: Plus },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CommerceDAO</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive ? "default" : "ghost"} 
                    className={`flex items-center space-x-2 transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-primary text-white shadow-lg' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:flex items-center space-x-2 border-border/50 hover:border-primary/50">
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </Button>
            
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;