'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
    'Operativo': '#10b981', // green
    'En Mantenimiento': '#f59e0b', // amber
    'Fuera Servicio': '#ef4444', // red
    'Desinstalado': '#6b7280' // gray
};

interface DataPoint {
    name: string;
    value: number;
    percentage: string;
}

interface EquipmentStatusChartProps {
    data: DataPoint[];
}

export default function EquipmentStatusChart({ data }: EquipmentStatusChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] neuro-text-tertiary">
                No hay datos disponibles
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'}
                        />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px'
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
