import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SidebarWithBlur from '@/components/layout/SidebarWithBlur';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema H - Gestión de Equipos Médicos',
  description: 'Sistema de gestión de equipos médicos hospitalarios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen">
          {/* Sidebar lateral con efecto de glassmorphism */}
          <SidebarWithBlur />
          
          {/* Contenido principal con margen para el sidebar */}
          <main className="ml-64 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          
          <ToastProvider />
        </div>
      </body>
    </html>
  );
}
