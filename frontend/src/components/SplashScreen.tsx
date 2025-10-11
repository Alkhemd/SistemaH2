'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const phases = [
      { delay: 500, phase: 1 },   // Logo fade in
      { delay: 1000, phase: 2 },  // Title blur to focus
      { delay: 2500, phase: 3 },  // Hero animation
      { delay: 3000, phase: 4 },  // Button fade in
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });

    // Auto-transition after 8 seconds
    const autoTransition = setTimeout(() => {
      handleTransition();
    }, 8000);

    return () => clearTimeout(autoTransition);
  }, []);

  const handleTransition = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  const handleSkip = () => {
    handleTransition();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: animationPhase >= 1 ? 0.6 : 0 }}
            onClick={handleSkip}
            className="absolute top-8 right-8 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors duration-200 text-sm font-medium"
          >
            Saltar
          </motion.button>

          <div className="flex flex-col items-center space-y-12">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: animationPhase >= 1 ? 1 : 0,
                scale: animationPhase >= 1 ? 1 : 0.8
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#0071E3] to-[#005BB5] rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-4xl font-bold">H</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ 
                opacity: animationPhase >= 2 ? 1 : 0,
                filter: animationPhase >= 2 ? "blur(0px)" : "blur(10px)"
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold text-[#1D1D1F] mb-2 tracking-tight">
                Sistema H
              </h1>
              <p className="text-xl text-[#6E6E73] font-medium">
                Gestión Médica Inteligente
              </p>
            </motion.div>

            {/* Hero Animation - Morphing Geometric Shapes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: animationPhase >= 3 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-80 h-40 flex items-center justify-center"
            >
              {/* Animated Shapes representing medical equipment connectivity */}
              <div className="absolute inset-0">
                {/* Central Hub */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0071E3] rounded-full"
                />

                {/* Orbiting Elements */}
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                    className="absolute top-1/2 left-1/2 origin-center"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${index * 72}deg) translateY(-60px)`
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      index % 2 === 0 ? 'bg-[#34C759]' : 'bg-[#FF9500]'
                    }`} />
                  </motion.div>
                ))}

                {/* Connecting Lines */}
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={`line-${index}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: animationPhase >= 3 ? 1 : 0,
                      opacity: animationPhase >= 3 ? 0.3 : 0
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 origin-center"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${index * 72}deg)`,
                      width: '60px',
                      height: '1px',
                      background: 'linear-gradient(90deg, #0071E3, transparent)'
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animationPhase >= 4 ? 1 : 0,
                y: animationPhase >= 4 ? 0 : 20
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={handleTransition}
              className="btn-primary text-lg px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Ingresar →
            </motion.button>
          </div>

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/20 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
