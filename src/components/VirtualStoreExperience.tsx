import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Box, Plane, Sphere, useTexture, Html } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, VolumeX, Volume2, Users, ShoppingCart, Maximize, Minimize } from 'lucide-react';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { useToast } from '@/hooks/use-toast';

interface VirtualProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  position: [number, number, number];
  color: string;
  inStock: boolean;
  discount?: number;
}

interface VirtualStoreConfig {
  theme: 'modern' | 'cyberpunk' | 'minimalist' | 'luxury';
  ambientSound: boolean;
  particles: boolean;
  lighting: 'bright' | 'ambient' | 'neon';
}

interface ProductDisplay3DProps {
  product: VirtualProduct;
  onClick: () => void;
  theme: string;
}

const ProductDisplay3D = ({ product, onClick, theme }: ProductDisplay3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.position.y = product.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  const themeColors = {
    modern: '#8B5CF6',
    cyberpunk: '#00FFFF', 
    minimalist: '#F3F4F6',
    luxury: '#F59E0B'
  };

  return (
    <group position={product.position}>
      {/* Product Display Platform */}
      <Plane 
        args={[2, 2]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]}
      >
        <meshStandardMaterial 
          color={hovered ? themeColors[theme as keyof typeof themeColors] : '#333333'}
          emissive={hovered ? themeColors[theme as keyof typeof themeColors] : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Plane>

      {/* Product Model */}
      <Box
        ref={meshRef}
        args={[1, 1, 1]}
        onClick={() => {
          onClick();
          setPurchased(true);
        }}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial 
          color={product.color}
          emissive={purchased ? '#10B981' : '#000000'}
          emissiveIntensity={purchased ? 0.3 : 0}
        />
      </Box>

      {/* Price Tag */}
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-semibold">
          ${product.price}
          {product.discount && (
            <span className="ml-2 text-green-400">-{product.discount}%</span>
          )}
        </div>
      </Html>

      {/* Product Info */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {product.name}
      </Text>

      {/* Stock Status */}
      {!product.inStock && (
        <Text
          position={[0, -1.3, 0]}
          fontSize={0.15}
          color="#EF4444"
          anchorX="center"
          anchorY="middle"
        >
          OUT OF STOCK
        </Text>
      )}

      {/* Holographic Effect */}
      {hovered && (
        <Sphere args={[1.5]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color={themeColors[theme as keyof typeof themeColors]}
            transparent
            opacity={0.1}
            emissive={themeColors[theme as keyof typeof themeColors]}
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}
    </group>
  );
};

const StoreEnvironment3D = ({ config, theme }: { config: VirtualStoreConfig; theme: string }) => {
  const themeEnvironments = {
    modern: {
      floor: '#2a2a2a',
      walls: '#1a1a1a',
      ceiling: '#0a0a0a'
    },
    cyberpunk: {
      floor: '#000a1a',
      walls: '#001122', 
      ceiling: '#000000'
    },
    minimalist: {
      floor: '#f8f9fa',
      walls: '#ffffff',
      ceiling: '#f1f3f4'
    },
    luxury: {
      floor: '#1a0f0a',
      walls: '#2a1a0a',
      ceiling: '#0a0505'
    }
  };

  const colors = themeEnvironments[config.theme];

  return (
    <>
      {/* Floor */}
      <Plane 
        args={[40, 40]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]}
      >
        <meshStandardMaterial color={colors.floor} />
      </Plane>
      
      {/* Walls */}
      <Plane args={[40, 20]} position={[0, 8, -20]}>
        <meshStandardMaterial color={colors.walls} />
      </Plane>
      <Plane args={[40, 20]} position={[-20, 8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color={colors.walls} />
      </Plane>
      <Plane args={[40, 20]} position={[20, 8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color={colors.walls} />
      </Plane>

      {/* Ceiling */}
      <Plane 
        args={[40, 40]} 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, 18, 0]}
      >
        <meshStandardMaterial color={colors.ceiling} />
      </Plane>

      {/* Store Logo */}
      <Text
        position={[0, 12, -18]}
        fontSize={2}
        color="#8B5CF6"
        anchorX="center"
        anchorY="middle"
      >
        Virtual Store
      </Text>

      {/* Theme-specific decorations */}
      {config.theme === 'cyberpunk' && (
        <>
          <pointLight position={[-15, 5, -15]} intensity={0.5} color="#00FFFF" />
          <pointLight position={[15, 5, -15]} intensity={0.5} color="#FF00FF" />
          <pointLight position={[0, 5, 15]} intensity={0.5} color="#FFFF00" />
        </>
      )}

      {config.theme === 'luxury' && (
        <>
          <pointLight position={[-10, 8, -10]} intensity={0.8} color="#F59E0B" />
          <pointLight position={[10, 8, -10]} intensity={0.8} color="#F59E0B" />
        </>
      )}
    </>
  );
};

interface VirtualStoreExperienceProps {
  storeId: string;
  storeName: string;
}

export const VirtualStoreExperience = ({ storeId, storeName }: VirtualStoreExperienceProps) => {
  const [config, setConfig] = useState<VirtualStoreConfig>({
    theme: 'modern',
    ambientSound: false,
    particles: true,
    lighting: 'ambient'
  });
  
  const [selectedProduct, setSelectedProduct] = useState<VirtualProduct | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visitorsCount, setVisitorsCount] = useState(12);
  const { connected } = useWeb3Wallet();
  const { toast } = useToast();

  // Mock products
  const virtualProducts: VirtualProduct[] = [
    {
      id: '1',
      name: 'Premium Headphones',
      price: 299,
      description: 'High-quality wireless headphones with noise cancellation',
      position: [-6, 0, -5],
      color: '#8B5CF6',
      inStock: true,
      discount: 15
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 399,
      description: 'Advanced fitness tracking and smart notifications',
      position: [-2, 0, -5],
      color: '#3B82F6',
      inStock: true
    },
    {
      id: '3',
      name: 'Gaming Mouse',
      price: 89,
      description: 'High-precision gaming mouse with RGB lighting',
      position: [2, 0, -5],
      color: '#10B981',
      inStock: false
    },
    {
      id: '4',
      name: 'Wireless Keyboard',
      price: 129,
      description: 'Mechanical keyboard with custom switches',
      position: [6, 0, -5],
      color: '#F59E0B',
      inStock: true,
      discount: 10
    },
    {
      id: '5',
      name: 'VR Headset',
      price: 699,
      description: 'Immersive virtual reality experience',
      position: [0, 0, -8],
      color: '#EF4444',
      inStock: true
    }
  ];

  const handleProductClick = (product: VirtualProduct) => {
    setSelectedProduct(product);
    toast({
      title: "Product Selected",
      description: `${product.name} - $${product.price}`,
    });
  };

  const handlePurchase = () => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to make purchases",
        variant: "destructive"
      });
      return;
    }

    if (selectedProduct) {
      toast({
        title: "Purchase Initiated! 🛒",
        description: `Processing purchase of ${selectedProduct.name}`,
      });
    }
  };

  // Simulate visitor count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorsCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Virtual <span className="text-gradient">Store Experience</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Immersive 3D shopping experience powered by Web3
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            {visitorsCount} online
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfig(prev => ({ ...prev, ambientSound: !prev.ambientSound }))}
          >
            {config.ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline" 
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 bg-gradient-card border-border/50">
            <h3 className="font-semibold mb-3">Store Theme</h3>
            <div className="space-y-2">
              {(['modern', 'cyberpunk', 'minimalist', 'luxury'] as const).map((theme) => (
                <Button
                  key={theme}
                  variant={config.theme === theme ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setConfig(prev => ({ ...prev, theme }))}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              ))}
            </div>
          </Card>

          {selectedProduct && (
            <Card className="p-4 bg-gradient-card border-border/50">
              <h3 className="font-semibold mb-3">{selectedProduct.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedProduct.description}
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Price:</span>
                  <div className="flex items-center gap-2">
                    {selectedProduct.discount && (
                      <span className="text-xs line-through text-muted-foreground">
                        ${selectedProduct.price}
                      </span>
                    )}
                    <span className="font-bold text-primary">
                      ${selectedProduct.discount 
                        ? (selectedProduct.price * (1 - selectedProduct.discount / 100)).toFixed(2)
                        : selectedProduct.price}
                    </span>
                  </div>
                </div>
                
                {selectedProduct.inStock ? (
                  <Button 
                    className="w-full bg-gradient-primary"
                    onClick={handlePurchase}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Purchase Now
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full">
                    Out of Stock
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* 3D Store View */}
        <div className="lg:col-span-3">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className={`w-full rounded-xl overflow-hidden bg-background border border-border ${
              isFullscreen ? 'h-[80vh]' : 'h-[600px]'
            }`}>
              <Canvas
                camera={{ position: [0, 8, 15], fov: 60 }}
                shadows
                dpr={[1, 2]}
                gl={{ antialias: true }}
              >
                <Suspense fallback={null}>
                  <Environment preset={config.theme === 'cyberpunk' ? 'night' : 'warehouse'} />
                  
                  {/* Dynamic Lighting */}
                  <ambientLight intensity={config.lighting === 'bright' ? 0.8 : 0.3} />
                  <directionalLight 
                    position={[10, 15, 10]} 
                    intensity={config.lighting === 'bright' ? 1.2 : 0.8} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]}
                  />
                  
                  {config.theme === 'cyberpunk' && (
                    <>
                      <pointLight position={[-10, 5, -10]} intensity={0.8} color="#00FFFF" />
                      <pointLight position={[10, 5, -10]} intensity={0.8} color="#FF00FF" />
                    </>
                  )}
                  
                  {/* Store Environment */}
                  <StoreEnvironment3D config={config} theme={config.theme} />
                  
                  {/* Products */}
                  {virtualProducts.map((product) => (
                    <ProductDisplay3D
                      key={product.id}
                      product={product}
                      onClick={() => handleProductClick(product)}
                      theme={config.theme}
                    />
                  ))}
                  
                  <OrbitControls 
                    enablePan={true}
                    minDistance={8}
                    maxDistance={30}
                    minPolarAngle={Math.PI / 8}
                    maxPolarAngle={Math.PI - Math.PI / 8}
                    target={[0, 0, -5]}
                  />
                </Suspense>
              </Canvas>
            </div>
            
            <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-muted/30">
              <p className="text-sm text-muted-foreground">
                🛒 Navigate: <strong>Drag</strong> to look around, <strong>Scroll</strong> to move closer, <strong>Click</strong> products to view details
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};