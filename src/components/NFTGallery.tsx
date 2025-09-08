import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Box, Plane, useTexture } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, ShoppingCart, Heart } from 'lucide-react';

interface NFTItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  creator: string;
  position: [number, number, number];
}

interface NFTFrame3DProps {
  nft: NFTItem;
  onClick: () => void;
}

const NFTFrame3D = ({ nft, onClick }: NFTFrame3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (hovered) {
        meshRef.current.position.y = nft.position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    }
  });

  const rarityColors = {
    common: '#94A3B8',
    rare: '#3B82F6', 
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  };

  return (
    <group position={nft.position}>
      {/* Frame */}
      <Box
        args={[0.1, 2.5, 2]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color={rarityColors[nft.rarity]} />
      </Box>
      
      {/* NFT Display */}
      <Plane 
        args={[1.8, 1.8]} 
        position={[0.05, 0, 0]}
        ref={meshRef}
        onClick={onClick}
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
          color={hovered ? '#ffffff' : '#f0f0f0'}
          emissive={hovered ? '#8B5CF6' : '#000000'}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </Plane>
      
      {/* Rarity Glow */}
      {nft.rarity !== 'common' && (
        <Plane args={[2.2, 2.2]} position={[-0.01, 0, 0]}>
          <meshStandardMaterial 
            color={rarityColors[nft.rarity]}
            emissive={rarityColors[nft.rarity]}
            emissiveIntensity={0.2}
            transparent
            opacity={0.3}
          />
        </Plane>
      )}
      
      {/* NFT Info */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        {nft.name}
      </Text>
      
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.12}
        color="#10B981"
        anchorX="center"
        anchorY="middle"
      >
        {nft.price} ETH
      </Text>
      
      <Text
        position={[0, -2.1, 0]}
        fontSize={0.1}
        color={rarityColors[nft.rarity]}
        anchorX="center"
        anchorY="middle"
      >
        {nft.rarity.toUpperCase()}
      </Text>
    </group>
  );
};

const GalleryEnvironment = () => {
  return (
    <>
      {/* Floor */}
      <Plane 
        args={[30, 30]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -3, 0]}
      >
        <meshStandardMaterial color="#0a0a0a" />
      </Plane>
      
      {/* Walls */}
      <Plane args={[30, 15]} position={[0, 4.5, -15]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>
      <Plane args={[30, 15]} position={[-15, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>
      <Plane args={[30, 15]} position={[15, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>
      
      {/* Gallery Title */}
      <Text
        position={[0, 8, -14]}
        fontSize={1.2}
        color="#8B5CF6"
        anchorX="center"
        anchorY="middle"
      >
        NFT Gallery
      </Text>
      
      {/* Ambient Lighting Effects */}
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#8B5CF6" />
      <pointLight position={[10, 5, -10]} intensity={0.3} color="#3B82F6" />
      <pointLight position={[0, 5, 10]} intensity={0.3} color="#10B981" />
    </>
  );
};

interface NFTGalleryProps {
  storeId: string;
  storeName: string;
}

export const NFTGallery = ({ storeId, storeName }: NFTGalleryProps) => {
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);

  // Mock NFT data
  const mockNFTs: NFTItem[] = [
    {
      id: '1',
      name: 'Exclusive Store Logo',
      description: 'Limited edition store logo NFT with utility benefits',
      price: 0.5,
      image: '/nft1.jpg',
      rarity: 'legendary',
      creator: storeName,
      position: [-8, 0, -8]
    },
    {
      id: '2', 
      name: 'VIP Membership Pass',
      description: 'Grants access to exclusive products and events',
      price: 0.3,
      image: '/nft2.jpg',
      rarity: 'epic',
      creator: storeName,
      position: [-4, 0, -8]
    },
    {
      id: '3',
      name: 'Token Holder Badge',
      description: 'Shows your commitment to the store community',
      price: 0.1,
      image: '/nft3.jpg',
      rarity: 'rare',
      creator: storeName,
      position: [0, 0, -8]
    },
    {
      id: '4',
      name: 'Product Collection #1',
      description: 'First edition product showcase NFT',
      price: 0.2,
      image: '/nft4.jpg',
      rarity: 'rare',
      creator: storeName,
      position: [4, 0, -8]
    },
    {
      id: '5',
      name: 'Community Supporter',
      description: 'Recognition for early community members',
      price: 0.05,
      image: '/nft5.jpg',
      rarity: 'common',
      creator: storeName,
      position: [8, 0, -8]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">
          NFT <span className="text-gradient">Gallery</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore exclusive NFT collections from {storeName}. Each NFT provides unique utility and community benefits.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 3D Gallery View */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="w-full h-[500px] rounded-xl overflow-hidden bg-background border border-border">
              <Canvas
                camera={{ position: [0, 8, 15], fov: 60 }}
                shadows
                dpr={[1, 2]}
                gl={{ antialias: true }}
              >
                <Suspense fallback={null}>
                  <Environment preset="night" />
                  
                  {/* Enhanced Lighting */}
                  <ambientLight intensity={0.1} />
                  <directionalLight 
                    position={[10, 15, 10]} 
                    intensity={0.5} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]}
                  />
                  <spotLight
                    position={[0, 10, 0]}
                    angle={Math.PI / 4}
                    penumbra={0.1}
                    intensity={0.8}
                    color="#ffffff"
                    castShadow
                  />
                  
                  {/* Gallery Environment */}
                  <GalleryEnvironment />
                  
                  {/* NFT Frames */}
                  {mockNFTs.map((nft) => (
                    <NFTFrame3D
                      key={nft.id}
                      nft={nft}
                      onClick={() => setSelectedNFT(nft)}
                    />
                  ))}
                  
                  <OrbitControls 
                    enablePan={true}
                    minDistance={8}
                    maxDistance={25}
                    minPolarAngle={Math.PI / 8}
                    maxPolarAngle={Math.PI - Math.PI / 8}
                    target={[0, 0, -5]}
                  />
                </Suspense>
              </Canvas>
            </div>
            
            <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-muted/30">
              <p className="text-sm text-muted-foreground">
                🎨 Navigate: <strong>Drag</strong> to rotate, <strong>Scroll</strong> to zoom, <strong>Click</strong> NFTs to view details
              </p>
            </div>
          </Card>
        </div>

        {/* NFT Details Panel */}
        <div className="space-y-6">
          {selectedNFT ? (
            <Card className="p-6 bg-gradient-card border-border/50">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedNFT.name}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className={
                      selectedNFT.rarity === 'legendary' ? 'border-yellow-500 text-yellow-500' :
                      selectedNFT.rarity === 'epic' ? 'border-purple-500 text-purple-500' :
                      selectedNFT.rarity === 'rare' ? 'border-blue-500 text-blue-500' : 
                      'border-gray-500 text-gray-500'
                    }
                  >
                    {selectedNFT.rarity}
                  </Badge>
                </div>
                <CardDescription>{selectedNFT.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-lg font-bold text-primary">{selectedNFT.price} ETH</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Creator</span>
                  <span className="text-sm font-medium">{selectedNFT.creator}</span>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-gradient-primary">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="text-center space-y-4">
                <Eye className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold mb-2">Select an NFT</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any NFT in the gallery to view details and purchase options.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Collection Stats */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="font-semibold mb-4">Collection Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Items</span>
                <span className="text-sm font-medium">{mockNFTs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Floor Price</span>
                <span className="text-sm font-medium">0.05 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Volume</span>
                <span className="text-sm font-medium">12.5 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Owners</span>
                <span className="text-sm font-medium">47</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};