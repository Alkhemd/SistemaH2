'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { name: 'Ordenes', href: '/ordenes', icon: ClipboardDocumentListIcon },
];

const catalogos = [
  { name: 'Modalidades', href: '/modalidades', icon: TagIcon },
  { name: 'Fabricantes', href: '/fabricantes', icon: BuildingOffice2Icon },
  { name: 'Tecnicos', href: '/tecnicos', icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistema Hospital</h1>
          <p className="text-gray-600">Gestion Medica Integral</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative p-6 rounded-xl text-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                }`}
              >
                {!isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-white/60 rounded-r-full group-hover:h-8 transition-all duration-200" />
                )}
                
                <item.icon className={`w-8 h-8 mx-auto mb-3 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <h3 className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {item.name}
                </h3>
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-gray-200 mb-6"></div>

        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Catalogos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {catalogos.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative p-4 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                }`}
              >
                {!isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-white/60 rounded-r-full group-hover:h-6 transition-all duration-200" />
                )}
                
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}