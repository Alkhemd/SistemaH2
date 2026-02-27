import React from 'react';
import { TechnicianWorkload } from '@/services/dashboardService';
import { Avatar } from '@/components/ui/Avatar';

interface TechnicianWorkloadListProps {
    data: TechnicianWorkload[];
}

export default function TechnicianWorkloadList({ data }: TechnicianWorkloadListProps) {
    const maxOrders = Math.max(...(data.length ? data.map(d => d.orders) : [1]), 1);

    return (
        <div className="card h-full">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold neuro-text-primary">
                        Carga de Técnicos
                    </h2>
                </div>

                <div className="space-y-5">
                    {data && data.length > 0 ? (
                        data.slice(0, 5).map((tech, index) => {
                            const widthPercentage = Math.min((tech.orders / maxOrders) * 100, 100);
                            const isOverloaded = tech.orders > 5; // Unbral de ejemplo

                            return (
                                <div key={tech.id} className="relative">
                                    <div className="flex justify-between items-center mb-2 gap-4">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <Avatar
                                                src={tech.avatar_url || ''}
                                                alt={tech.name}
                                                fallback={tech.name}
                                                size="sm"
                                                className="border-none shrink-0"
                                            />
                                            <span className="text-sm font-medium neuro-text-primary truncate" title={tech.name}>
                                                {tech.name}
                                            </span>
                                        </div>
                                        <div className="text-xs font-bold neuro-text-secondary shrink-0 text-right">
                                            {tech.orders} {tech.orders === 1 ? 'orden' : 'órdenes'}
                                            {tech.urgentes > 0 && <span className="text-red-500 ml-1">({tech.urgentes} urgentes)</span>}
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 neuro-inner-shadow overflow-hidden">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-1000 ${isOverloaded ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                                }`}
                                            style={{ width: `${widthPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 neuro-text-secondary text-sm">
                            <p>No hay técnicos activos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
