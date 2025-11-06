'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '@/services/dashboardService';
import { testSupabaseConnection } from '@/utils/testSupabase';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/components/ui/Toast';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Probar conexión con Supabase
        await testSupabaseConnection();
        
        // Obtener estadísticas desde Supabase
        console.log('🔍 Cargando estadísticas del dashboard...');
        const statsResponse = await dashboardService.getEstadisticas();
        
        console.log('📊 Respuesta de estadísticas:', statsResponse);
        
        if (statsResponse.error) {
          console.error('❌ Error en statsResponse:', statsResponse.error);
          throw new Error(statsResponse.error.message);
        }

        console.log('✅ Datos de estadísticas:', statsResponse.data);
        setStats(statsResponse.data);
        
        // Cargar actividad reciente desde Supabase
        console.log('🔍 Cargando actividad reciente...');
        const activityResponse = await dashboardService.getActividadReciente();
        
        if (activityResponse.error) {
          console.warn('⚠️ Error al cargar actividad reciente:', activityResponse.error);
          setRecentActivity([]);
        } else {
          console.log('✅ Actividad reciente:', activityResponse.data);
          setRecentActivity(activityResponse.data || []);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast.error('Error al cargar estadísticas del dashboard');
        // Datos de fallback
        setStats({
          totalEquipments: 0,
          openOrders: 0,
          maintenanceEquipments: 0,
          operativeEquipments: 0,
        });
        setRecentActivity([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-lg neuro-text-secondary">
          Vista general del sistema de gestión médica
        </p>
        {stats && (
          <p className="text-sm neuro-text-tertiary mt-2">
            Datos cargados: {stats.totalEquipments} equipos, {stats.openOrders} órdenes, {stats.maintenanceEquipments} en mantenimiento, {stats.operativeEquipments} operativos
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {stats ? [
          {
            title: 'Total Equipos',
            value: stats?.totalEquipments?.toString() || '0',
            change: '+12%',
            changeType: 'positive' as const,
            icon: CubeIcon,
            description: 'equipos registrados'
          },
          {
            title: 'Órdenes Abiertas',
            value: stats?.openOrders?.toString() || '0',
            change: '-8%',
            changeType: 'negative' as const,
            icon: ExclamationTriangleIcon,
            description: 'pendientes'
          },
          {
            title: 'En Mantenimiento',
            value: stats?.maintenanceEquipments?.toString() || '0',
            change: '+5%',
            changeType: 'positive' as const,
            icon: ClockIcon,
            description: 'equipos'
          },
          {
            title: 'Operativos',
            value: stats?.operativeEquipments?.toString() || '0',
            change: '+23%',
            changeType: 'positive' as const,
            icon: CheckCircleIcon,
            description: 'funcionando'
          }
        ].map((stat: any, index: number) => (
          <div key={stat.title} className="card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium neuro-text-secondary mb-1">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold neuro-text-primary mb-2">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 neuro-convex-sm flex items-center justify-center">
                  <stat.icon className="w-6 h-6 neuro-text-secondary" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {stat.changeType === 'positive' ? (
                    <ArrowTrendingUpIcon className="icon-sm text-green-500" />
                  ) : (
                    <ArrowTrendingDownIcon className="icon-sm text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm neuro-text-secondary">
                    {stat.description}
                  </span>
                </div>
              </div>

              {/* Mini chart */}
              <div className="mt-4 flex items-end justify-between h-8 neuro-concave-sm p-1">
                {[20, 25, 22, 30, 28, 35, 32].map((value: number, i: number) => (
                  <div
                    key={i}
                    className={`w-2 rounded-sm transition-all duration-300 ${
                      stat.changeType === 'positive' ? 'bg-green-400' : 'bg-red-400'
                    }`}
                    style={{
                      height: `${Math.max((value / 35) * 100, 10)}%`,
                      animationDelay: `${0.5 + i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-4 card p-8 text-center">
            <p className="neuro-text-secondary">No se pudieron cargar las estadísticas</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold neuro-text-primary">
              Actividad Reciente
            </h2>
            <button className="neuro-button px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Ver todo
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity: any, index: number) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 neuro-convex-sm hover:neuro-concave-sm rounded-xl transition-all duration-200 cursor-pointer"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'Cerrada' || activity.status === 'Completada' ? 'bg-green-500' :
                      activity.status === 'En_Proceso' || activity.status === 'Asignada' ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium neuro-text-primary">
                        {activity.equipment || 'Equipo sin nombre'}
                      </p>
                      <p className="text-sm neuro-text-secondary">
                        {activity.client || 'Cliente desconocido'} • {activity.description || 'Sin descripción'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm neuro-text-secondary">
                      {activity.time || 'Tiempo desconocido'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium neuro-convex-sm ${
                        activity.type === 'Crítica' || activity.type === 'Alta' ? 'text-red-600' :
                        activity.type === 'Media' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {activity.type || 'Normal'}
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium neuro-convex-sm ${
                        activity.status === 'Cerrada' || activity.status === 'Completada' ? 'text-green-600 bg-green-50' :
                        activity.status === 'En_Proceso' || activity.status === 'Asignada' ? 'text-yellow-600 bg-yellow-50' : 
                        'text-red-600 bg-red-50'
                      }`}>
                        {activity.status?.replace('_', ' ') || 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 neuro-text-secondary">
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}