import React, { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { TrendData } from '@/services/dashboardService';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface TrendsChartProps {
    data: TrendData[];
    onPeriodChange: (days: number) => void;
    currentPeriod: number;
}

export default function TrendsChart({ data, onPeriodChange, currentPeriod }: TrendsChartProps) {
    const [hoveredData, setHoveredData] = useState<any>(null);

    const formatXAxis = (tickItem: string) => {
        try {
            return format(parseISO(tickItem), 'dd MMM', { locale: es });
        } catch {
            return tickItem;
        }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="neuro-card-soft p-3 text-sm">
                    <p className="font-medium text-gray-700 mb-2">
                        {format(parseISO(label), 'dd MMMM yyyy', { locale: es })}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-600">{entry.name}</span>
                            </div>
                            <span className="font-bold ml-4" style={{ color: entry.color }}>
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card h-full flex flex-col">
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold neuro-text-primary">
                            Tendencia de Operaciones
                        </h2>
                        <p className="text-sm neuro-text-secondary mt-1">
                            Volumen de órdenes abiertas vs cerradas a lo largo del tiempo
                        </p>
                    </div>

                    <div className="flex space-x-2 mt-4 sm:mt-0 p-1 bg-gray-100 rounded-lg">
                        {[7, 30, 90].map((days) => (
                            <button
                                key={days}
                                onClick={() => onPeriodChange(days)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${currentPeriod === days
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {days === 7 ? '7D' : days === 30 ? '1M' : '3M'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-grow w-full mt-4" style={{ minHeight: '300px' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            onMouseMove={(e: any) => {
                                if (e.isTooltipActive) {
                                    setHoveredData(e.activePayload?.[0]?.payload);
                                } else {
                                    setHoveredData(null);
                                }
                            }}
                            onMouseLeave={() => setHoveredData(null)}
                        >
                            <defs>
                                <linearGradient id="colorAbiertas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCerradas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatXAxis}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px', paddingBottom: '20px' }} />
                            <Area
                                type="monotone"
                                dataKey="abiertas"
                                name="Órdenes Abiertas"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAbiertas)"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="cerradas"
                                name="Órdenes Cerradas"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCerradas)"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
