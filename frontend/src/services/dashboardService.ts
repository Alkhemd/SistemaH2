import { backendClient } from '../lib/backendClient';

export interface DashboardStats {
  totalEquipments: number;
  openOrders: number;
  maintenanceEquipments: number;
  operativeEquipments: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  status: string;
  equipment?: string;
  client?: string;
  time?: string;
}

export interface TrendData {
  date: string;
  abiertas: number;
  cerradas: number;
}

export interface SparklineStat {
  value: number;
  trend: number[];
  delta: number;
}

export interface SummaryStats {
  totalEquipments: SparklineStat;
  openOrders: SparklineStat;
  maintenanceEquipments: SparklineStat;
  operativeEquipments: SparklineStat;
}

export interface TechnicianWorkload {
  id: string;
  name: string;
  avatar_url?: string | null;
  orders: number;
  urgentes: number;
}

class DashboardService {
  async getEstadisticas(): Promise<{ data: DashboardStats | null; error: any }> {
    return backendClient.get<DashboardStats>('/dashboard/stats');
  }

  async getActividadReciente(): Promise<{ data: RecentActivity[] | null; error: any }> {
    return backendClient.get<RecentActivity[]>('/dashboard/activity');
  }

  async getChartData(): Promise<{ data: any | null; error: any }> {
    return backendClient.get('/dashboard/charts');
  }

  async getTrends(days: number = 7): Promise<{ data: TrendData[] | null; error: any }> {
    return backendClient.get<TrendData[]>(`/dashboard/trends?days=${days}`);
  }

  async getSummaryStats(): Promise<{ data: SummaryStats | null; error: any }> {
    return backendClient.get<SummaryStats>('/dashboard/summary-stats');
  }

  async getTechnicianWorkload(): Promise<{ data: TechnicianWorkload[] | null; error: any }> {
    return backendClient.get<TechnicianWorkload[]>('/dashboard/technician-workload');
  }
}

export const dashboardService = new DashboardService();