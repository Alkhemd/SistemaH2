'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
    'Crítica': '#dc2626', // red-600
    'Alta': '#f59e0b', // amber-500
    'Media': '#3b82f6', // blue-500
    'Baja': '#10b981', // green-500
    'Normal': '#6b7280', // gray-500
    'critica': '#dc2626',
    'normal': '#6b7280'
};

interface DataPoint {
    name: string;
    value: number;
    percentage: string;
}

interface OrdersPriorityChartProps {
    data: DataPoint[];
}

export default function OrdersPriorityChart({ data }: OrdersPriorityChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] neuro-text-tertiary">
                No hay datos disponibles
            </div>
        );
    }

    // Consolidate duplicate priorities (e.g., "Crítica" and "critica")
    const consolidatedData = data.reduce((acc: DataPoint[], curr) => {
        const normalized = curr.name.charAt(0).toUpperCase() + curr.name.slice(1).toLowerCase();
        const existing = acc.find(item =>
            item.name.toLowerCase() === normalized.toLowerCase()
        );

        if (existing) {
            existing.value += curr.value;
            existing.percentage = ((parseFloat(existing.percentage) + parseFloat(curr.percentage))).toFixed(1);
        } else {
            acc.push({ ...curr, name: normalized });
        }

        return acc;
    }, []);

    // Sort by value descending
    const sortedData = consolidatedData.sort((a, b) => b.value - a.value);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px'
                    }}
                    formatter={(value: any, name: any, props: any) => [
                        `${value} órdenes (${props.payload.percentage}%)`,
                        'Cantidad'
                    ]}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {sortedData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
