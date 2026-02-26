'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { dashboardService, SummaryStats, TrendData, TechnicianWorkload } from '@/services/dashboardService';
import dynamic from 'next/dynamic';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { showToast } from '@/components/ui/Toast';
import SparklineCard from '@/components/dashboard/SparklineCard';

// Dynamically import charts to avoid SSR issues
const EquipmentStatusChart = dynamic(() => import('@/components/charts/EquipmentStatusChart'), { ssr: false });
const OrdersPriorityChart = dynamic(() => import('@/components/charts/OrdersPriorityChart'), { ssr: false });
const TrendsChart = dynamic(() => import('@/components/dashboard/TrendsChart'), { ssr: false });
const TechnicianWorkloadList = dynamic(() => import('@/components/dashboard/TechnicianWorkloadList'), { ssr: false });

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  // States
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [trendsPeriod, setTrendsPeriod] = useState<number>(7);
  const [workload, setWorkload] = useState<TechnicianWorkload[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  const loadTrends = useCallback(async (days: number) => {
    setIsLoadingTrends(true);
    try {
      const response = await dashboardService.getTrends(days);
      if (!response.error) {
        setTrends(response.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTrends(false);
    }
  }, []);

  const handlePeriodChange = (days: number) => {
    setTrendsPeriod(days);
    loadTrends(days);
  };

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);

        const [
          summaryResponse,
          activityResponse,
          chartsResponse,
          trendsResponse,
          workloadResponse
        ] = await Promise.all([
          dashboardService.getSummaryStats(),
          dashboardService.getActividadReciente(),
          dashboardService.getChartData(),
          dashboardService.getTrends(trendsPeriod),
          dashboardService.getTechnicianWorkload()
        ]);

        if (!isMounted) return;

        if (summaryResponse.error) throw new Error(summaryResponse.error.message);
        setSummaryStats(summaryResponse.data);

        if (!activityResponse.error) setRecentActivity(activityResponse.data || []);
        if (!chartsResponse.error) setChartData(chartsResponse.data);
        if (!trendsResponse.error) setTrends(trendsResponse.data || []);
        if (!workloadResponse.error) setWorkload(workloadResponse.data || []);

      } catch (error) {
        if (!isMounted) return;
        console.error('Error loading dashboard data:', error);
        if (showLoading) showToast.error('Error al cargar estadísticas del dashboard');
      } finally {
        if (isMounted && showLoading) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData(true);

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadDashboardData(false);
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [trendsPeriod]);

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        {summaryStats ? (
          <>
            <SparklineCard
              title="Total Equipos"
              value={summaryStats.totalEquipments?.value || 0}
              trend={summaryStats.totalEquipments?.trend || []}
              delta={summaryStats.totalEquipments?.delta || 0}
              index={0}
              icon={CubeIcon}
              description="equipos registrados"
              gradient="from-blue-50 via-blue-100/50 to-transparent"
              iconBg="from-blue-100 to-blue-50"
              iconColor="text-blue-600"
              valueGradient="from-blue-600 to-blue-400"
              hoverAccent="bg-blue-500/5"
            />
            <SparklineCard
              title="Órdenes Abiertas"
              value={summaryStats.openOrders?.value || 0}
              trend={summaryStats.openOrders?.trend || []}
              delta={summaryStats.openOrders?.delta || 0}
              index={1}
              icon={ExclamationTriangleIcon}
              description="pendientes"
              gradient="from-red-50 via-red-100/50 to-transparent"
              iconBg="from-red-100 to-red-50"
              iconColor="text-red-600"
              valueGradient="from-red-600 to-red-400"
              hoverAccent="bg-red-500/5"
            />
            <SparklineCard
              title="En Mantenimiento"
              value={summaryStats.maintenanceEquipments?.value || 0}
              trend={summaryStats.maintenanceEquipments?.trend || []}
              delta={summaryStats.maintenanceEquipments?.delta || 0}
              index={2}
              icon={ClockIcon}
              description="equipos"
              gradient="from-amber-50 via-amber-100/50 to-transparent"
              iconBg="from-amber-100 to-amber-50"
              iconColor="text-amber-600"
              valueGradient="from-amber-600 to-amber-400"
              hoverAccent="bg-amber-500/5"
            />
            <SparklineCard
              title="Operativos"
              value={summaryStats.operativeEquipments?.value || 0}
              trend={summaryStats.operativeEquipments?.trend || []}
              delta={summaryStats.operativeEquipments?.delta || 0}
              index={3}
              icon={CheckCircleIcon}
              description="funcionando"
              gradient="from-green-50 via-green-100/50 to-transparent"
              iconBg="from-green-100 to-green-50"
              iconColor="text-green-600"
              valueGradient="from-green-600 to-green-400"
              hoverAccent="bg-green-500/5"
            />
          </>
        ) : (
          <div className="col-span-4 card p-8 text-center">
            <p className="neuro-text-secondary">No se pudieron cargar las estadísticas</p>
          </div>
        )}
      </div>


      {/* Trends Chart */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <TrendsChart
          data={trends}
          currentPeriod={trendsPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Charts & Workload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>

        {/* Left Column: Distribution Charts & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {chartData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="card">
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
                      <div className="text-right space-y-1 hidden sm:block">
                        <p className="text-sm neuro-text-secondary">
                          {activity.time || 'Tiempo desconocido'}
                        </p>
                        <div className="flex items-center space-x-2 justify-end">
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

        {/* Right Column: Technician Workload */}
        <div className="lg:col-span-1">
          <TechnicianWorkloadList data={workload} />
        </div>
      </div>
    </div>
  );
}