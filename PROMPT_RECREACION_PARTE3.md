# 🏥 Sistema H - Prompt de Recreación (Parte 3/3)

## 🎬 COMPONENTES DE ANIMACIÓN

### 1. ScrollReveal.tsx

```tsx
'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="sr-word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Animación de rotación
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll('.sr-word');

    // Animación de opacidad
    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=20%',
          end: 'bottom bottom',
          scrub: true
        }
      }
    );

    // Animación de blur
    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=20%',
            end: 'bottom bottom',
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [enableBlur, baseRotation, baseOpacity, blurStrength]);

  return (
    <h2 ref={containerRef as any} className="scroll-reveal">
      <p className="scroll-reveal-text">{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
```

### 2. SplitText.tsx

```tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP as any);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: any;
  to?: any;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  tag = 'p',
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if ((document as any).fonts?.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      (document as any).fonts?.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current as any;

      const splitInstance = new (GSAPSplitText as any)(el, {
        type: splitType,
        onSplit: (self: any) => {
          const targets = self.chars || self.words || self.lines;
          gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true
              }
            }
          );
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach((st: any) => {
          if (st.trigger === el) st.kill();
        });
        splitInstance.revert();
      };
    },
    {
      dependencies: [text, delay, duration, ease, splitType, fontsLoaded],
      scope: ref
    }
  );

  const Tag = tag;
  return (
    <Tag ref={ref as any} className={`split-parent ${className}`}>
      {text}
    </Tag>
  );
};

export default SplitText;
```

### 3. SplashScreen.tsx

```tsx
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
        >
          <button
            onClick={handleTransition}
            className="absolute top-8 right-8 text-gray-500 hover:text-gray-900"
          >
            Saltar
          </button>

          <div className="flex flex-col items-center space-y-12">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: animationPhase >= 1 ? 1 : 0,
                scale: animationPhase >= 1 ? 1 : 0.8
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl">
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
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                Sistema H
              </h1>
              <p className="text-xl text-gray-600">
                Gestión Médica Inteligente
              </p>
            </motion.div>

            {/* Animated Shapes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: animationPhase >= 3 ? 1 : 0 }}
              className="relative w-80 h-40 flex items-center justify-center"
            >
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
                className="absolute w-4 h-4 bg-blue-600 rounded-full"
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
                    delay: index * 0.2
                  }}
                  className="absolute"
                  style={{
                    transform: `rotate(${index * 72}deg) translateY(-60px)`
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    index % 2 === 0 ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animationPhase >= 4 ? 1 : 0,
                y: animationPhase >= 4 ? 0 : 20
              }}
              onClick={handleTransition}
              className="btn-primary text-lg px-8 py-4 rounded-2xl"
            >
              Ingresar →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
```

### 4. SidebarWithBlur.tsx

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  HomeIcon,
  CubeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  BuildingOffice2Icon,
  UserIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Equipos', href: '/equipos', icon: CubeIcon },
  { name: 'Clientes', href: '/clientes', icon: UserGroupIcon },
  { name: 'Órdenes', href: '/ordenes', icon: ClipboardDocumentListIcon },
];

const catalogos = [
  { name: 'Modalidades', href: '/modalidades', icon: TagIcon },
  { name: 'Fabricantes', href: '/fabricantes', icon: BuildingOffice2Icon },
  { name: 'Técnicos', href: '/tecnicos', icon: UserIcon },
];

function AnimatedText({ text, isActive }: { text: string; isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-block"
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            scale: isHovered && !isActive ? 1.15 : 1,
            y: isHovered && !isActive ? -2 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
            delay: index * 0.02,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function SidebarWithBlur() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Backdrop Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 pointer-events-none"
        style={{ display: isHovered ? 'block' : 'none' }}
      />

      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed left-0 top-0 h-screen w-64 bg-white/70 backdrop-blur-2xl border-r border-gray-200/50 shadow-2xl z-40"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Sistema H
          </h1>
          <p className="text-sm text-gray-600 mt-1">Gestión Médica</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">
              Principal
            </p>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
                  </motion.div>
                  <AnimatedText text={item.name} isActive={isActive} />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Catálogos */}
          <div>
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">
              Catálogos
            </p>
            {catalogos.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                  </motion.div>
                  <AnimatedText text={item.name} isActive={isActive} />
                  {isActive && (
                    <motion.div
                      layoutId="activeCatalog"
                      className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Usuario</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
```

---

## 📄 PÁGINAS PRINCIPALES

### Dashboard (/app/dashboard/page.tsx)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CubeIcon, ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEquipments: 0,
    openOrders: 0,
    maintenanceEquipments: 0,
    operativeEquipments: 0,
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Vista general del sistema</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Equipos', value: stats.totalEquipments, icon: CubeIcon, color: 'blue' },
          { title: 'Órdenes Abiertas', value: stats.openOrders, icon: ExclamationTriangleIcon, color: 'red' },
          { title: 'En Mantenimiento', value: stats.maintenanceEquipments, icon: ClockIcon, color: 'yellow' },
          { title: 'Operativos', value: stats.operativeEquipments, icon: CheckCircleIcon, color: 'green' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 SCRIPTS DE INICIO

### START.bat
```batch
@echo off
echo ========================================
echo   Sistema H - Inicio Rapido
echo ========================================

echo [1/3] Iniciando Backend API...
cd HospitalApi
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Esperando backend...
timeout /t 5 /nobreak >nul

echo [3/3] Iniciando Frontend...
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo Backend: http://localhost:3000
echo Docs: http://localhost:3000/api-docs
echo Frontend: http://localhost:3001
pause
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend
- [ ] Instalar dependencias: `npm install`
- [ ] Configurar database.js (Sequelize + SQLite)
- [ ] Crear 13 modelos con validaciones
- [ ] Definir relaciones en models/index.js
- [ ] Implementar BaseController
- [ ] Crear controladores específicos
- [ ] Configurar rutas API
- [ ] Configurar Swagger
- [ ] Implementar middleware de errores
- [ ] Crear script init-database.js
- [ ] Ejecutar: `npm run init-db`
- [ ] Ejecutar: `npm run dev`

### Frontend
- [ ] Instalar dependencias: `npm install`
- [ ] Configurar TailwindCSS 4
- [ ] Crear globals.css con variables CSS
- [ ] Implementar componentes UI base
- [ ] Crear componentes de animación (ScrollReveal, SplitText)
- [ ] Implementar SidebarWithBlur
- [ ] Crear SplashScreen
- [ ] Configurar Zustand store
- [ ] Implementar hooks de API (SWR)
- [ ] Crear páginas (Dashboard, Equipos, Clientes, etc.)
- [ ] Configurar layout.tsx
- [ ] Ejecutar: `npm run dev`

### Testing
- [ ] Probar endpoints en Swagger
- [ ] Verificar animaciones
- [ ] Probar CRUD completo
- [ ] Verificar responsive design
- [ ] Probar navegación
- [ ] Verificar estado global

---

## 🎯 RESULTADO ESPERADO

Un sistema completo, profesional y animado con:
- ✅ Backend API REST funcional con 13 tablas
- ✅ Frontend moderno con Next.js 15 + React 19
- ✅ Animaciones fluidas estilo Apple
- ✅ Sidebar con blur effect y animaciones
- ✅ SplashScreen animado
- ✅ CRUD completo para todas las entidades
- ✅ Documentación Swagger
- ✅ Diseño responsive
- ✅ Arquitectura limpia y escalable
