"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Text3D,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import ClientOnly from "./ClientOnly";
import { Text } from "@react-three/drei";

// 3D JSON Cube component
function JsonCube({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.005;
      mesh.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh
        ref={mesh}
        position={position as [number, number, number]}
        rotation={rotation as [number, number, number]}
        scale={scale * Math.min(viewport.width, viewport.height) * 0.15}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.2}
          emissive="#4f46e5"
          emissiveIntensity={0.2}
        />
        <Center position={[0, 0, 0.51]}>
          <Text color="white" fontSize={0.2} anchorX="center" anchorY="middle">
            {"{"}
          </Text>
        </Center>
        <Center position={[0, 0, -0.51]} rotation={[0, Math.PI, 0]}>
          <Text color="white" fontSize={0.2} anchorX="center" anchorY="middle">
            {"}"}
          </Text>
        </Center>
      </mesh>
    </Float>
  );
}

// The actual Three.js scene
function ThreeScene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <JsonCube />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

// 3D Scene component with client-only wrapper
export default function Scene() {
  return (
    <ClientOnly>
      <div className="w-full h-full">
        <ThreeScene />
      </div>
    </ClientOnly>
  );
}
