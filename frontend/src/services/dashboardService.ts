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

class DashboardService {
  async getEstadisticas(): Promise<{ data: DashboardStats | null; error: any }> {
    return backendClient.get<DashboardStats>('/dashboard/stats');
  }

  async getActividadReciente(): Promise<{ data: RecentActivity[] | null; error: any }> {
    return backendClient.get<RecentActivity[]>('/dashboard/activity');
  }
}

export const dashboardService = new DashboardService();