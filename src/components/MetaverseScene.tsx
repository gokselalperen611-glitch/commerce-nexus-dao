import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Box, Sphere, Plane } from '@react-three/drei';
import { Mesh } from 'three';
import { Store } from '@/types';
import { Loader2 } from 'lucide-react';

interface Product3DProps {
  position: [number, number, number];
  name: string;
  price: number;
  onClick: () => void;
}

const Product3D = ({ position, name, price, onClick }: Product3DProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[1, 1, 1]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.object.scale.set(1.1, 1.1, 1.1);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.object.scale.set(1, 1, 1);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial color="#8B5CF6" />
      </Box>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.25}
        color="#10B981"
        anchorX="center"
        anchorY="middle"
      >
        ${price}
      </Text>
    </group>
  );
};

const StoreEnvironment = ({ store }: { store: Store }) => {
  return (
    <>
      {/* Floor */}
      <Plane 
        args={[20, 20]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]}
      >
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>
      
      {/* Walls */}
      <Plane args={[20, 10]} position={[0, 3, -10]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Plane>
      
      {/* Store Logo Sphere */}
      <Sphere args={[1]} position={[0, 2, -8]}>
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.2} />
      </Sphere>
      
      {/* Store Name */}
      <Text
        position={[0, 5, -9]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {store.name}
      </Text>
      
      {/* Token Symbol */}
      <Text
        position={[0, 0.5, -8]}
        fontSize={0.5}
        color="#10B981"
        anchorX="center"
        anchorY="middle"
      >
        ${store.tokenSymbol}
      </Text>
    </>
  );
};

interface MetaverseSceneProps {
  store: Store;
  isOwner?: boolean;
  onProductClick?: (productId: string) => void;
}

const MetaverseScene = ({ store, isOwner = false, onProductClick }: MetaverseSceneProps) => {
  // Mock products for demo
  const mockProducts = [
    { id: '1', name: 'Premium Product A', price: 99.99, position: [-3, 0, -2] as [number, number, number] },
    { id: '2', name: 'Best Seller B', price: 149.99, position: [3, 0, -2] as [number, number, number] },
    { id: '3', name: 'New Launch C', price: 79.99, position: [0, 0, 2] as [number, number, number] },
    { id: '4', name: 'Limited Edition', price: 199.99, position: [-4, 0, 4] as [number, number, number] },
    { id: '5', name: 'Customer Favorite', price: 119.99, position: [4, 0, 4] as [number, number, number] },
  ];

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden bg-background border border-border">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="warehouse" />
          
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[5, 10, 5]} 
            intensity={0.8} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#8B5CF6" />
          
          {/* Store Environment */}
          <StoreEnvironment store={store} />
          
          {/* Products */}
          {mockProducts.map((product) => (
            <Product3D
              key={product.id}
              position={product.position}
              name={product.name}
              price={product.price}
              onClick={() => onProductClick?.(product.id)}
            />
          ))}
          
          <OrbitControls 
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading Overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading Metaverse...</span>
          </div>
        </div>
      }>
        <div />
      </Suspense>
    </div>
  );
};

export default MetaverseScene;