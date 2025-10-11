'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

// Componente para el efecto de hover en el texto
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
      {/* Overlay de difuminación para el contenido principal */}
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
        className="fixed left-0 top-0 h-screen w-64 bg-white/70 backdrop-blur-2xl border-r border-gray-200/50 shadow-2xl shadow-gray-900/10 z-40"
      >
      {/* Header */}
      <motion.div 
        className="p-6 border-b border-gray-200/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1 
          className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Sistema H
        </motion.h1>
        <motion.p 
          className="text-sm text-gray-600 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Gestión Médica
        </motion.p>
      </motion.div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        <div className="mb-6">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Principal
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-[1.02]'
                  }
                `}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
                </motion.div>
                <AnimatedText text={item.name} isActive={isActive} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-lg"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Catalogos */}
        <div>
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Catálogos
          </p>
          {catalogos.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:scale-[1.02]'
                  }
                `}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                </motion.div>
                <AnimatedText text={item.name} isActive={isActive} />
                {isActive && (
                  <motion.div
                    layoutId="activeCatalog"
                    className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-lg"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-white/30 backdrop-blur-xl cursor-pointer"
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            U
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.p 
              className="text-sm font-medium text-gray-900 truncate"
              whileHover={{ x: 2 }}
            >
              Usuario
            </motion.p>
            <p className="text-xs text-gray-500 truncate">Admin</p>
          </div>
        </div>
      </motion.div>
    </motion.aside>
    </>
  );
}
