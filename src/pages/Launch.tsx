import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Rocket, 
  CheckCircle, 
  Store, 
  Settings, 
  DollarSign, 
  Users,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Zap
} from 'lucide-react';

const Launch = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: '',
    storeUrl: '',
    platform: '',
    tokenName: '',
    tokenSymbol: '',
    initialSupply: '',
    rewardRate: '',
    description: ''
  });

  const steps = [
    { id: 1, title: 'Store Connection', icon: Store, description: 'Connect your existing store' },
    { id: 2, title: 'Token Configuration', icon: Settings, description: 'Set up your token parameters' },
    { id: 3, title: 'Governance Setup', icon: Users, description: 'Configure governance rules' },
    { id: 4, title: 'Verification', icon: ShieldCheck, description: 'Verify your business' },
    { id: 5, title: 'Launch', icon: Rocket, description: 'Deploy your token' }
  ];

  const platforms = [
    { value: 'shopify', label: 'Shopify', description: 'OAuth integration with full API access' },
    { value: 'woocommerce', label: 'WooCommerce', description: 'WordPress plugin installation' },
    { value: 'bigcommerce', label: 'BigCommerce', description: 'API key integration' },
    { value: 'custom', label: 'Custom Store', description: 'Manual integration setup' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Launch Your <span className="text-gradient">Store Token</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your e-commerce business into a community-owned DAO in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8 bg-gradient-card border-border/50">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div 
                  key={step.id} 
                  className={`text-center ${
                    isCurrent ? 'text-primary' : 
                    isCompleted ? 'text-success' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    isCurrent ? 'bg-primary/10' : 
                    isCompleted ? 'bg-success/10' : 'bg-secondary'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Step Content */}
        <Card className="p-8 bg-gradient-card border-border/50">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Connect Your Store</h2>
                <p className="text-muted-foreground">
                  Connect your existing e-commerce store to begin the tokenization process
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input 
                    id="storeName"
                    value={formData.storeName}
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                    placeholder="Enter your store name"
                    className="bg-background/50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="storeUrl">Store URL</Label>
                  <Input 
                    id="storeUrl"
                    value={formData.storeUrl}
                    onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                    placeholder="https://your-store.com"
                    className="bg-background/50"
                  />
                </div>
                
                <div>
                  <Label>Platform</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {platforms.map((platform) => (
                      <Card 
                        key={platform.value}
                        className={`p-4 cursor-pointer border transition-colors ${
                          formData.platform === platform.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border/50 hover:border-primary/30'
                        }`}
                        onClick={() => setFormData({...formData, platform: platform.value})}
                      >
                        <div className="font-medium mb-1">{platform.label}</div>
                        <div className="text-sm text-muted-foreground">{platform.description}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Configure Your Token</h2>
                <p className="text-muted-foreground">
                  Set up the parameters for your store's custom token
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="tokenName">Token Name</Label>
                  <Input 
                    id="tokenName"
                    value={formData.tokenName}
                    onChange={(e) => setFormData({...formData, tokenName: e.target.value})}
                    placeholder="e.g. TechHub Token"
                    className="bg-background/50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tokenSymbol">Token Symbol</Label>
                  <Input 
                    id="tokenSymbol"
                    value={formData.tokenSymbol}
                    onChange={(e) => setFormData({...formData, tokenSymbol: e.target.value.toUpperCase()})}
                    placeholder="e.g. TECH"
                    className="bg-background/50"
                    maxLength={5}
                  />
                </div>
                
                <div>
                  <Label htmlFor="initialSupply">Initial Supply</Label>
                  <Input 
                    id="initialSupply"
                    value={formData.initialSupply}
                    onChange={(e) => setFormData({...formData, initialSupply: e.target.value})}
                    placeholder="e.g. 10000000"
                    className="bg-background/50"
                    type="number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rewardRate">Reward Rate (%)</Label>
                  <Input 
                    id="rewardRate"
                    value={formData.rewardRate}
                    onChange={(e) => setFormData({...formData, rewardRate: e.target.value})}
                    placeholder="e.g. 15"
                    className="bg-background/50"
                    type="number"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Token Description</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your token and its utility..."
                  className="bg-background/50"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Governance Configuration</h2>
                <p className="text-muted-foreground">
                  Set up how token holders will participate in your business decisions
                </p>
              </div>
              
              <div className="space-y-6">
                <Card className="p-6 border-border/50">
                  <h3 className="font-semibold mb-4">Proposal Thresholds</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Product Decisions</Label>
                      <Input placeholder="100 tokens" className="bg-background/50" />
                    </div>
                    <div>
                      <Label>Business Operations</Label>
                      <Input placeholder="1000 tokens" className="bg-background/50" />
                    </div>
                    <div>
                      <Label>Financial Decisions</Label>
                      <Input placeholder="5000 tokens" className="bg-background/50" />
                    </div>
                    <div>
                      <Label>Major Changes</Label>
                      <Input placeholder="10000 tokens" className="bg-background/50" />
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 border-border/50">
                  <h3 className="font-semibold mb-4">Profit Sharing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Profit Share Percentage</Label>
                      <Select>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="30">30%</SelectItem>
                          <SelectItem value="50">50%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Distribution Frequency</Label>
                      <Select>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Business Verification</h2>
                <p className="text-muted-foreground">
                  Verify your business to build trust with potential token holders
                </p>
              </div>
              
              <div className="space-y-4">
                <Card className="p-6 border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Revenue History</h3>
                      <p className="text-sm text-muted-foreground">
                        Minimum 3 months of sales data required
                      </p>
                    </div>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect Analytics
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-6 border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Business Registration</h3>
                      <p className="text-sm text-muted-foreground">
                        Tax ID and business license verification
                      </p>
                    </div>
                    <Button variant="outline">
                      Upload Documents
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-6 border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Identity Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        KYC process for store owner
                      </p>
                    </div>
                    <Button variant="outline">
                      Start KYC
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center">
                <Zap className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Launch!</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Your token configuration is complete. Review the details below and launch your store token.
                </p>
              </div>
              
              <Card className="p-6 border-border/50 text-left max-w-md mx-auto">
                <h3 className="font-semibold mb-4">Launch Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Store:</span>
                    <span className="font-medium">{formData.storeName || 'Your Store'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Token:</span>
                    <span className="font-medium">{formData.tokenSymbol || 'TOKEN'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supply:</span>
                    <span className="font-medium">{formData.initialSupply || '10,000,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rewards:</span>
                    <span className="font-medium">{formData.rewardRate || '15'}%</span>
                  </div>
                </div>
              </Card>
              
              <Button size="lg" className="bg-gradient-primary px-8 glow-effect">
                <Rocket className="w-5 h-5 mr-2" />
                Launch Token
              </Button>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-border/50"
          >
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="bg-gradient-primary">
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div /> // Empty div for spacing when on last step
          )}
        </div>
      </div>
    </div>
  );
};

export default Launch;