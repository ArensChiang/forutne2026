import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Cylinder, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function FortuneCoin({ onClick, ...props }) {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // Animation loop
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Idle rotation
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;

            // Hover scale effect
            const scale = hovered ? 1.2 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 10);
        }
    });

    return (
        <group {...props}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setActive(!active);
                    onClick && onClick();
                }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                rotation={[Math.PI / 2, 0, 0]}
            >
                {/* Coin Body (Cylinder) */}
                <cylinderGeometry args={[2.5, 2.5, 0.3, 64]} />
                <meshStandardMaterial
                    color="#ffd700"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#ffaa00"
                    emissiveIntensity={0.1}
                />

                {/* Front Text */}
                <Text
                    position={[0, 0.16, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={1.2}
                    color="#b8860b" // Dark gold
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.05}
                    outlineColor="#8b4513"
                >
                    2026
                </Text>

                {/* Back Text */}
                <Text
                    position={[0, -0.16, 0]}
                    rotation={[Math.PI / 2, 0, Math.PI]} // Flipped for the back
                    fontSize={0.8}
                    color="#b8860b"
                    anchorX="center"
                    anchorY="middle"
                >
                    招財進寶
                </Text>
            </mesh>
        </group>
    );
}
