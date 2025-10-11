'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fade, slideUp } from '@/lib/animationPresets';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  TagIcon,
  BuildingOffice2Icon,
  UserIcon
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogosOpen, setCatalogosOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const catalogosRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (catalogosRef.current && !catalogosRef.current.contains(event.target as Node)) {
        setCatalogosOpen(false);
      }
    }

    if (catalogosOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [catalogosOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            className="flex items-center"
          >
            <Link href="/dashboard" className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-lg">H</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Sistema H</span>
                <p className="text-xs text-gray-500 -mt-1">Gestión Médica</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Estilo Apple */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const isHovered = hoveredItem === item.name;
              
              return (
                <motion.div
                  key={item.name}
                  onHoverStart={() => setHoveredItem(item.name)}
                  onHoverEnd={() => setHoveredItem(null)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className="relative block px-3 py-1.5 text-sm font-normal text-gray-700 hover:text-gray-900 transition-colors duration-200"
                  >
                    {item.name}
                    
                    {/* Efecto hover - Estilo Apple */}
                    {isHovered && !isActive && (
                      <motion.div
                        layoutId="navHover"
                        className="absolute inset-0 bg-gray-100/80 rounded-lg -z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      />
                    )}
                    
                    {/* Indicador activo - Estilo Apple */}
                    {isActive && (
                      <motion.div
                        layoutId="navActive"
                        className="absolute inset-0 bg-gray-200/70 rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
            
            {/* Catálogos Dropdown - Estilo Apple */}
            <div className="relative" ref={catalogosRef}>
              <motion.button
                onHoverStart={() => setHoveredItem('catalogos')}
                onHoverEnd={() => setHoveredItem(null)}
                onClick={() => setCatalogosOpen(!catalogosOpen)}
                className="relative px-3 py-1.5 text-sm font-normal text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Catálogos</span>
                <ChevronDownIcon 
                  className={`w-3 h-3 transition-transform duration-200 ${
                    catalogosOpen ? 'rotate-180' : ''
                  }`} 
                />
                
                {/* Efecto hover */}
                {(hoveredItem === 'catalogos' || catalogosOpen) && (
                  <motion.div
                    className="absolute inset-0 bg-gray-100/80 rounded-lg -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
              
              {/* Dropdown Menu - Estilo Apple */}
              <AnimatePresence>
                {catalogosOpen && (
                  <>
                    {/* Backdrop blur */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
                      style={{ top: '64px' }}
                      onClick={() => setCatalogosOpen(false)}
                    />
                    
                    {/* Menu desplegable */}
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                      }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white/95 backdrop-blur-2xl rounded-xl shadow-xl border border-gray-200/60 overflow-hidden"
                    >
                      <div className="py-2">
                        {catalogos.map((item, index) => {
                          const isActive = pathname === item.href;
                          return (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setCatalogosOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${
                                  isActive 
                                    ? 'text-primary-600 bg-primary-50/50' 
                                    : 'text-gray-700 hover:bg-gray-50/80'
                                }`}
                              >
                                <item.icon className={`w-4 h-4 ${
                                  isActive ? 'text-primary-600' : 'text-gray-500'
                                }`} />
                                <span className="font-normal">{item.name}</span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side actions - Estilo Apple */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bars3Icon className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Estilo Apple mejorado */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay con blur - Estilo Apple */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              style={{ top: '64px' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu móvil */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.32, 0.72, 0, 1]
              }}
              className="fixed top-16 left-0 right-0 md:hidden bg-white/95 backdrop-blur-2xl border-b border-gray-200/50 shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="px-4 py-6 space-y-1">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.32, 0.72, 0, 1]
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-primary-600 bg-primary-50/80'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${
                          isActive ? 'text-primary-600' : 'text-gray-500'
                        }`} />
                        <span>{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobileActiveIndicator"
                            className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Divisor */}
                <div className="pt-2 pb-1">
                  <div className="h-px bg-gray-200/60"></div>
                </div>
                
                {/* Catálogos en móvil */}
                <div className="pt-1">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Catálogos
                  </div>
                  {catalogos.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: (navigation.length + index) * 0.05,
                          duration: 0.3,
                          ease: [0.32, 0.72, 0, 1]
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-primary-600 bg-primary-50/80'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${
                            isActive ? 'text-primary-600' : 'text-gray-500'
                          }`} />
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
