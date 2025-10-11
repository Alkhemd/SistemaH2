'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  CubeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  BuildingOffice2Icon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
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

export default function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Menú centrado horizontal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-900/10 border border-gray-200/50 overflow-hidden"
      >
        {/* Botón de cerrar en móvil - Estilo Apple */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-6 right-6 lg:hidden p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 backdrop-blur-sm"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        </button>

        {/* Contenedor centrado y estilizado */}
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="pt-8 pb-6 px-6 text-center border-b border-gray-100/60">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
              Hospital System
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Gestión Médica
            </p>
          </div>

          {/* Navegación principal centrada */}
          <nav className="flex-1 px-4 py-8">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="relative group block"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full shadow-sm"
                          transition={{ 
                            type: 'spring', 
                            stiffness: 400, 
                            damping: 25
                          }}
                        />
                      )}

                      <div
                        className={`relative flex items-center justify-center flex-col px-6 py-4 rounded-2xl mx-2 transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50/80 to-blue-100/60 text-blue-700 shadow-lg shadow-blue-100/50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:shadow-md'
                        }`}
                      >
                        <item.icon
                          className={`w-6 h-6 mb-2 transition-all duration-300 ${
                            isActive ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-gray-700 group-hover:scale-105'
                          }`}
                          strokeWidth={isActive ? 2.5 : 2}
                        />

                        <span
                          className={`text-sm font-medium text-center leading-tight ${
                            isActive ? 'font-semibold' : 'font-normal'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Sección Catálogos */}
            <div className="mt-8 pt-6 border-t border-gray-100/60">
              <div className="px-4 mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Catálogos
                </h3>
              </div>
              
              <div className="space-y-2">
                {catalogos.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="relative group block"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicatorCatalogos"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full shadow-sm"
                            transition={{ 
                              type: 'spring', 
                              stiffness: 400, 
                              damping: 25
                            }}
                          />
                        )}

                        <div
                          className={`relative flex items-center space-x-3 px-6 py-3 rounded-xl mx-2 transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 text-emerald-700 shadow-lg shadow-emerald-100/50'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 hover:shadow-md'
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                              isActive ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-700'
                            }`}
                            strokeWidth={isActive ? 2.5 : 2}
                          />

                          <span
                            className={`text-sm font-medium ${
                              isActive ? 'font-semibold' : 'font-normal'
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer mejorado */}
          <div className="px-6 py-4 border-t border-gray-100/60 bg-gray-50/30">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">
                Sistema Hospital
              </div>
              <div className="text-xs text-blue-600 font-semibold mt-1">
                v2.0 • Premium
              </div>
            </div>
          </div>
        </div>

        {/* Footer simplificado */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center font-medium">
            Sistema Hospital <span className="text-blue-600 font-semibold">v1.0</span>
          </div>
        </div>
      </motion.aside>

      {/* Spacer para desktop - Actualizado */}
      <div className="hidden lg:block w-72 flex-shrink-0" />
    </>
  );
}
