'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardApi } from '@/lib/api';
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
        const statsResponse = await dashboardApi.getEstadisticas();
        
        // Mapear las estadísticas del backend al formato esperado
        const statsData = statsResponse.data.data || statsResponse.data;
        const mappedStats = {
          totalEquipments: statsData?.totalEquipos || 0,
          openOrders: statsData?.ordenesAbiertas || 0,
          maintenanceEquipments: statsData?.equiposMantenimiento || 0,
          operativeEquipments: statsData?.equiposOperativos || 0,
        };

        setStats(mappedStats);
        
        // Cargar actividad reciente
        const activityResponse = await dashboardApi.getActividadReciente();
        const activityData = activityResponse.data.data || activityResponse.data;
        setRecentActivity(activityData || []);
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Vista general del sistema de gestión médica
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {stats && [
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
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-xl icon-container">
                  <stat.icon className="icon-md text-gray-600" />
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
                  <span className="text-sm text-gray-500">
                    {stat.description}
                  </span>
                </div>
              </div>

              {/* Mini chart */}
              <div className="mt-4 flex items-end justify-between h-8 bg-gray-50 rounded-lg p-1">
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
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Actividad Reciente
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
              Ver todo
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity: any, index: number) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'completado' ? 'bg-green-500' :
                      activity.status === 'proceso' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.equipment || 'Equipo sin nombre'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.client || 'Cliente desconocido'} • {activity.type || 'Tipo desconocido'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-gray-500">
                      {activity.time || 'Tiempo desconocido'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        activity.priority === 'critica' ? 'status-fuera-servicio' :
                        activity.priority === 'alta' ? 'status-mantenimiento' : 'status-operativo'
                      }`}>
                        {activity.priority || 'Normal'}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completado' ? 'status-operativo' :
                        activity.status === 'proceso' ? 'status-mantenimiento' : 'status-fuera-servicio'
                      }`}>
                        {activity.status || 'Desconocido'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}