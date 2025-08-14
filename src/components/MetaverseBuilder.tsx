import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Box, 
  Lightbulb, 
  Music, 
  Settings, 
  Save,
  Eye,
  RotateCcw,
  Package,
  Sparkles
} from 'lucide-react';
import MetaverseScene from './MetaverseScene';
import { Store } from '@/types';

interface MetaverseConfig {
  theme: 'modern' | 'futuristic' | 'minimalist' | 'cyberpunk';
  floorColor: string;
  wallColor: string;
  lightingIntensity: number;
  ambientMusic: boolean;
  productLayout: 'grid' | 'circle' | 'random' | 'showcase';
  specialEffects: boolean;
}

const defaultConfig: MetaverseConfig = {
  theme: 'modern',
  floorColor: '#1a1a1a',
  wallColor: '#2a2a2a',
  lightingIntensity: 0.8,
  ambientMusic: false,
  productLayout: 'grid',
  specialEffects: true,
};

interface MetaverseBuilderProps {
  store: Store;
  onSave: (config: MetaverseConfig) => void;
}

const MetaverseBuilder = ({ store, onSave }: MetaverseBuilderProps) => {
  const [config, setConfig] = useState<MetaverseConfig>(defaultConfig);
  const [isPreview, setIsPreview] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = (updates: Partial<MetaverseConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(config);
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setHasChanges(true);
  };

  const themes = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
    { id: 'futuristic', name: 'Futuristic', description: 'Sci-fi inspired design' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon and high-tech' },
  ];

  const layouts = [
    { id: 'grid', name: 'Grid Layout', icon: '⊞' },
    { id: 'circle', name: 'Circle Layout', icon: '○' },
    { id: 'random', name: 'Random Layout', icon: '✦' },
    { id: 'showcase', name: 'Showcase Layout', icon: '◈' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary" />
            Metaverse Mağaza Oluşturucu
          </h2>
          <p className="text-muted-foreground mt-1">
            Mağazanız için sanal gerçeklik deneyimi tasarlayın
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="border-border/50"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            className="border-border/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-gradient-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Card className="p-4 bg-warning/10 border-warning/30">
          <p className="text-warning text-sm">
            You have unsaved changes. Don't forget to save your metaverse configuration.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-gradient-card border-border/50">
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
              </TabsList>

              <TabsContent value="theme" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Store Theme</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((theme) => (
                      <Card
                        key={theme.id}
                        className={`p-3 cursor-pointer transition-all border ${
                          config.theme === theme.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border/50 hover:bg-muted/30'
                        }`}
                        onClick={() => updateConfig({ theme: theme.id as any })}
                      >
                        <div className="text-sm font-medium">{theme.name}</div>
                        <div className="text-xs text-muted-foreground">{theme.description}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Colors</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Floor Color</Label>
                      <Input
                        type="color"
                        value={config.floorColor}
                        onChange={(e) => updateConfig({ floorColor: e.target.value })}
                        className="h-8 w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Wall Color</Label>
                      <Input
                        type="color"
                        value={config.wallColor}
                        onChange={(e) => updateConfig({ wallColor: e.target.value })}
                        className="h-8 w-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Product Layout</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {layouts.map((layout) => (
                      <Card
                        key={layout.id}
                        className={`p-3 cursor-pointer transition-all border flex items-center ${
                          config.productLayout === layout.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border/50 hover:bg-muted/30'
                        }`}
                        onClick={() => updateConfig({ productLayout: layout.id as any })}
                      >
                        <span className="text-lg mr-3">{layout.icon}</span>
                        <span className="text-sm font-medium">{layout.name}</span>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Lighting</Label>
                  <div>
                    <Label className="text-xs">Intensity: {config.lightingIntensity}</Label>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={config.lightingIntensity}
                      onChange={(e) => updateConfig({ lightingIntensity: parseFloat(e.target.value) })}
                      className="w-full mt-1"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Audio & Effects</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ambient Music</span>
                      <input
                        type="checkbox"
                        checked={config.ambientMusic}
                        onChange={(e) => updateConfig({ ambientMusic: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Special Effects</span>
                      <input
                        type="checkbox"
                        checked={config.specialEffects}
                        onChange={(e) => updateConfig({ specialEffects: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4 bg-gradient-card border-border/50">
            <h3 className="font-medium mb-3 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Metaverse Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Products</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theme</span>
                <Badge variant="outline">{config.theme}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Layout</span>
                <Badge variant="outline">{config.productLayout}</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Live Preview</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {config.theme}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {config.productLayout}
                </Badge>
              </div>
            </div>
            
            <MetaverseScene 
              store={store}
              isOwner={true}
              onProductClick={(productId) => {
                console.log('Product clicked:', productId);
              }}
            />
            
            <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-muted/30">
              <p className="text-sm text-muted-foreground">
                💡 Use mouse to navigate: <strong>Drag</strong> to rotate, <strong>Scroll</strong> to zoom, <strong>Click</strong> products to interact
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MetaverseBuilder;