import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei';
import { FortuneCoin } from './FortuneCoin';

export function Experience({ onCoinClick }) {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ height: '400px', width: '100%' }} // Adjust styling as needed
        >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="red" />

            <Suspense fallback={null}>
                <group position={[0, -0.5, 0]}>
                    <FortuneCoin onClick={onCoinClick} />
                </group>

                <Environment preset="city" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Suspense>

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 2.5}
                maxPolarAngle={Math.PI / 1.5}
            />
        </Canvas>
    );
}
