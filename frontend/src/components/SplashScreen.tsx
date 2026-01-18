'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Edges, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Icosahedron Component using Three.js
const RotatingIcosahedron = () => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (outerRef.current) {
      outerRef.current.rotation.x += 0.003;
      outerRef.current.rotation.y += 0.005;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= 0.004;
      innerRef.current.rotation.y -= 0.006;
    }
  });

  return (
    <group>
      {/* Outer Icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 0]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges
          threshold={15}
          color="#2D3748"
          lineWidth={1}
        />
      </mesh>

      {/* Inner Icosahedron */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges
          threshold={15}
          color="#38A169"
          lineWidth={0.8}
        />
      </mesh>
    </group>
  );
};

// 3D Scene wrapper
const Scene3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Suspense fallback={null}>
          <RotatingIcosahedron />
        </Suspense>
      </Canvas>
    </div>
  );
};

// ECG/Heartbeat line animation
const HeartbeatLine = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="relative w-full h-16 flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 400 60"
        className="w-80 h-16"
        style={{ filter: 'drop-shadow(0 0 8px rgba(26, 32, 44, 0.3))' }}
      >
        <motion.path
          d="M0,30 L80,30 L95,30 L100,10 L110,50 L120,20 L130,40 L140,30 L160,30 L320,30 L335,30 L340,10 L350,50 L360,20 L370,40 L380,30 L400,30"
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isActive ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2D3748" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#1A202C" stopOpacity="1" />
            <stop offset="70%" stopColor="#38A169" stopOpacity="1" />
            <stop offset="100%" stopColor="#38A169" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Pulse dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: 'radial-gradient(circle, #38A169 0%, transparent 70%)',
          boxShadow: '0 0 15px rgba(56, 161, 105, 0.8)',
        }}
        initial={{ left: '10%', opacity: 0 }}
        animate={isActive ? {
          left: ['10%', '90%'],
          opacity: [0, 1, 1, 0],
        } : { opacity: 0 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 0.5,
        }}
      />
    </div>
  );
};

// Subtle grid pattern
const GridPattern = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.02]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(26, 32, 44, 0.5) 1px, transparent 1px),
        linear-gradient(90deg, rgba(26, 32, 44, 0.5) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }}
  />
);

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const phases = [
      { delay: 300, phase: 1 },
      { delay: 800, phase: 2 },
      { delay: 1500, phase: 3 },
      { delay: 2200, phase: 4 },
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });

    const autoTransition = setTimeout(() => {
      handleTransition();
    }, 7000);

    return () => clearTimeout(autoTransition);
  }, []);

  const handleTransition = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };



  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #E8EBF0, #F5F7FA)',
          }}
        >
          {/* 3D Scene */}
          {mounted && <Scene3D />}

          {/* Grid pattern */}
          <GridPattern />

          {/* Ambient gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-1/2 h-1/2"
              style={{
                background: 'radial-gradient(ellipse at 30% 30%, rgba(45, 55, 72, 0.04) 0%, transparent 60%)',
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-1/2 h-1/2"
              style={{
                background: 'radial-gradient(ellipse at 70% 70%, rgba(56, 161, 105, 0.04) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: animationPhase >= 1 ? 0.6 : 0 }}
            whileHover={{ opacity: 1 }}
            onClick={handleTransition}
            className="absolute top-6 right-6 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 z-20"
            style={{
              color: '#4A5568',
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            Saltar
          </motion.button>

          {/* Main Content */}
          <div className="flex flex-col items-center space-y-8 relative z-10">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              animate={{
                opacity: animationPhase >= 1 ? 1 : 0,
                scale: animationPhase >= 1 ? 1 : 0.5,
                rotateY: animationPhase >= 1 ? 0 : -90,
              }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="relative"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-[32px]"
                style={{ boxShadow: '0 0 60px rgba(26, 32, 44, 0.15)' }}
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(26, 32, 44, 0.1)',
                    '0 0 60px rgba(26, 32, 44, 0.2)',
                    '0 0 30px rgba(26, 32, 44, 0.1)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Logo container */}
              <div
                className="relative w-28 h-28 rounded-[32px] flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 50%, #171923 100%)',
                  boxShadow: `
                    20px 20px 40px rgba(163, 177, 198, 0.5),
                    -20px -20px 40px rgba(255, 255, 255, 0.9),
                    inset 2px 2px 4px rgba(255, 255, 255, 0.1),
                    inset -2px -2px 4px rgba(0, 0, 0, 0.3)
                  `,
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
                  }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-white text-5xl font-bold relative z-10"
                  style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' }}
                >
                  H
                </span>
              </div>

              {/* Medical cross accent */}
              <motion.div
                className="absolute -right-2 -bottom-2 w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #38A169 0%, #2F855A 100%)',
                  boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.4)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: animationPhase >= 1 ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: "backOut" }}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V3z" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: animationPhase >= 2 ? 1 : 0 }}
              className="text-center space-y-3"
            >
              <motion.h1
                className="text-5xl md:text-6xl font-bold tracking-tight"
                style={{ color: '#1A202C' }}
              >
                {"Sistema H".split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: animationPhase >= 2 ? 1 : 0,
                      y: animationPhase >= 2 ? 0 : 20,
                    }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.4,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl font-medium"
                style={{ color: '#4A5568' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: animationPhase >= 2 ? 1 : 0,
                  y: animationPhase >= 2 ? 0 : 10,
                }}
                transition={{ delay: 0.5 }}
              >
                Gestión Médica Inteligente
              </motion.p>
            </motion.div>

            {/* ECG/Heartbeat Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: animationPhase >= 3 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <HeartbeatLine isActive={animationPhase >= 3} />
            </motion.div>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationPhase >= 3 ? 1 : 0 }}
            >
              {['Equipos', 'Órdenes', 'Técnicos', 'Reportes'].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(8px)',
                    color: '#2D3748',
                    boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.3), -4px -4px 10px rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{
                    opacity: animationPhase >= 3 ? 1 : 0,
                    scale: animationPhase >= 3 ? 1 : 0.8,
                    y: animationPhase >= 3 ? 0 : 10,
                  }}
                  transition={{ delay: 0.3 + index * 0.1, ease: "backOut" }}
                >
                  {feature}
                </motion.div>
              ))}
            </motion.div>


          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
