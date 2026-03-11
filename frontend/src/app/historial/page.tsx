'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService, RecentActivity } from '@/services/dashboardService';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import { ChevronLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function HistorialPage() {
    const [activities, setActivities] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const loadHistory = async () => {
            try {
                // Usar el servicio que ya tiene la URL correcta del backend
                const response = await dashboardService.getActividadReciente(50);
                if (!response.error) {
                    setActivities(response.data || []);
                }
            } catch (error) {
                console.error('Error loading history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, []);

    const filteredActivities = activities.filter(act => {
        if (!selectedDate) return true;

        // Comparar la fecha de la actividad con la fecha seleccionada (YYYY-MM-DD)
        const actDate = act.timestamp.split('T')[0];
        return actDate === selectedDate;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="p-2 neuro-convex-sm hover:neuro-concave-sm rounded-full transition-all">
                    <ChevronLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold neuro-text-primary">Historial de Actividad</h1>
                    <p className="neuro-text-secondary text-sm">Registro detallado de todos los movimientos del sistema</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="card p-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 neuro-concave-sm transition-all text-gray-600"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                            <button className="flex items-center space-x-2 px-4 py-2 neuro-convex-sm rounded-xl text-sm font-medium hover:neuro-concave-sm transition-all">
                                <Filter size={16} />
                                <span>Filtros</span>
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />
                                ))}
                            </div>
                        ) : filteredActivities.length > 0 ? (
                            <ActivityTimeline
                                activities={filteredActivities.map(act => ({
                                    ...act,
                                    time: act.time || '',
                                    status: act.status || 'CREATED'
                                }))}
                                showTitle={false}
                            />
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Search size={24} className="text-gray-300" />
                                </div>
                                <p className="text-gray-500 font-medium">No se encontraron actividades para este día</p>
                                <button
                                    onClick={() => setSelectedDate('')}
                                    className="mt-4 text-blue-600 text-sm font-semibold hover:underline transition-all"
                                >
                                    Ver todo el historial
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold neuro-text-primary mb-4">Resumen</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between p-3 neuro-convex-sm rounded-lg">
                                <span className="text-sm text-gray-500">Total actividades</span>
                                <span className="font-bold">{activities.length}</span>
                            </div>
                            <div className="flex justify-between p-3 neuro-convex-sm rounded-lg">
                                <span className="text-sm text-gray-500">Últimas 24h</span>
                                <span className="font-bold">{activities.filter(a => a.time?.includes('min') || a.time?.includes('hora')).length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
