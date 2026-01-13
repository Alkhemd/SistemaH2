'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '@/services/dashboardService';
import dynamic from 'next/dynamic';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/components/ui/Toast';

// Dynamically import charts to avoid SSR issues
const EquipmentStatusChart = dynamic(() => import('@/components/charts/EquipmentStatusChart'), { ssr: false });
const OrdersPriorityChart = dynamic(() => import('@/components/charts/OrdersPriorityChart'), { ssr: false });

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Hacer las 3 peticiones en PARALELO
        const [statsResponse, activityResponse, chartsResponse] = await Promise.all([
          dashboardService.getEstadisticas(),
          dashboardService.getActividadReciente(),
          dashboardService.getChartData()
        ]);

        // Procesar estadísticas
        if (statsResponse.error) {
          throw new Error(statsResponse.error.message);
        }
        setStats(statsResponse.data);

        // Procesar actividad reciente
        if (!activityResponse.error) {
          setRecentActivity(activityResponse.data || []);
        }

        // Procesar datos de gráficas
        if (!chartsResponse.error) {
          setChartData(chartsResponse.data);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast.error('Error al cargar estadísticas del dashboard');
        setStats({
          totalEquipments: 0,
          openOrders: 0,
          maintenanceEquipments: 0,
          operativeEquipments: 0,
        });
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
      {/* Header  */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-lg neuro-text-secondary">
          Vista general del sistema de gestión médica
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {stats ? [
          {
            title: 'Total Equipos',
            value: stats?.totalEquipments?.toString() || '0',
            icon: CubeIcon,
            description: 'equipos registrados',
            color: 'blue'
          },
          {
            title: 'Órdenes Abiertas',
            value: stats?.openOrders?.toString() || '0',
            icon: ExclamationTriangleIcon,
            description: 'pendientes',
            color: 'red'
          },
          {
            title: 'En Mantenimiento',
            value: stats?.maintenanceEquipments?.toString() || '0',
            icon: ClockIcon,
            description: 'equipos',
            color: 'amber'
          },
          {
            title: 'Operativos',
            value: stats?.operativeEquipments?.toString() || '0',
            icon: CheckCircleIcon,
            description: 'funcionando',
            color: 'green'
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
                  <p className="text-sm neuro-text-tertiary">
                    {stat.description}
                  </p>
                </div>
                <div className="w-12 h-12 neuro-convex-sm flex items-center justify-center">
                  <stat.icon className="w-6 h-6 neuro-text-secondary" />
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-4 card p-8 text-center">
            <p className="neuro-text-secondary">No se pudieron cargar las estadísticas</p>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Equipment Status Chart */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold neuro-text-primary mb-4">
                Distribución de Equipos
              </h2>
              <EquipmentStatusChart data={chartData.equipmentByStatus || []} />
            </div>
          </div>

          {/* Orders Priority Chart */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold neuro-text-primary mb-4">
                Órdenes por Prioridad
              </h2>
              <OrdersPriorityChart data={chartData.ordersByPriority || []} />
            </div>
          </div>
        </div>
      )}

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
                    <div className={`w-3 h-3 rounded-full ${activity.status === 'Cerrada' || activity.status === 'Completada' ? 'bg-green-500' :
                      activity.status === 'En Proceso' || activity.status === 'Asignada' ? 'bg-yellow-500' :
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
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium neuro-convex-sm ${activity.type === 'Crítica' || activity.type === 'Alta' ? 'text-red-600' :
                        activity.type === 'Media' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                        {activity.type || 'Normal'}
                      </span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium neuro-convex-sm ${activity.status === 'Cerrada' || activity.status === 'Completada' ? 'text-green-600 bg-green-50' :
                        activity.status === 'En Proceso' || activity.status === 'Asignada' ? 'text-yellow-600 bg-yellow-50' :
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