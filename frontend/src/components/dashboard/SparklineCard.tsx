import React from 'react';
import { motion } from 'framer-motion';

interface SparklineCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    gradient: string;
    iconBg: string;
    iconColor: string;
    valueGradient: string;
    hoverAccent: string;
    trend: number[];
    delta: number;
    index: number;
}

export default function SparklineCard({
    title,
    value,
    description,
    icon: Icon,
    gradient,
    iconBg,
    iconColor,
    valueGradient,
    hoverAccent,
    trend,
    delta,
    index
}: SparklineCardProps) {
    // Simple SVG Sparkline generator
    const maxHit = Math.max(...(trend.length ? trend : [1]));
    const minHit = Math.min(...(trend.length ? trend : [0]));
    const range = maxHit - minHit || 1;
    const height = 40;
    const width = 120;

    const points = trend.map((v, i) => {
        const x = (i / (trend.length - 1)) * width;
        const y = height - ((v - minHit) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const deltaText = delta > 0 ? `+${delta}%` : `${delta}%`;
    const deltaColor = delta > 0 ? 'text-green-500' : delta < 0 ? 'text-red-500' : 'text-gray-400';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <div className="neuro-card-soft p-4 h-full relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                {title}
                            </p>
                            <div className="flex items-baseline space-x-2">
                                <p className={`text-4xl font-bold bg-gradient-to-br ${valueGradient} bg-clip-text text-transparent`}>
                                    {value}
                                </p>
                                {delta !== 0 && (
                                    <span className={`text-xs font-bold ${deltaColor}`}>
                                        {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}%
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{description}</p>
                        </div>
                        <div className={`w-12 h-12 flex-shrink-0 neuro-convex-sm rounded-xl flex items-center justify-center bg-gradient-to-br ${iconBg}`}>
                            <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <svg width={width} height={height} className="overflow-visible">
                            <polyline
                                points={points}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`opacity-50 ${iconColor.replace('text-', 'stroke-')}`}
                            />
                        </svg>
                    </div>
                </div>
                <div className={`absolute inset-0 ${hoverAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            </div>
        </motion.div>
    );
}
