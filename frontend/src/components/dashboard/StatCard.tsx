'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'red';
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  onClick
}: StatCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-[#0071E3]',
      accent: 'border-[#0071E3]'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-[#34C759]',
      accent: 'border-[#34C759]'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-[#FF9500]',
      accent: 'border-[#FF9500]'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-[#FF3B30]',
      accent: 'border-[#FF3B30]'
    }
  };

  const classes = colorClasses[color];

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        y: -6,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 17
        }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        card w-full h-44 cursor-pointer relative overflow-hidden
        ${onClick ? 'hover:shadow-xl' : ''}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 transition-all duration-500 group-hover:opacity-10">
        <Icon size={96} className={classes.icon} />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.div
            className={`p-3 rounded-xl ${classes.bg} transition-all duration-300`}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <Icon size={24} className={`${classes.icon} transition-transform duration-300`} />
          </motion.div>

          {trend && (
            <motion.div
              className={`text-sm font-medium ${trend.isPositive ? 'text-[#34C759]' : 'text-[#FF3B30]'
                }`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <motion.div
            className="text-3xl font-bold text-[#1D1D1F] leading-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.div>
          <div className="text-[#6E6E73] font-medium">
            {title}
          </div>
        </div>

        {/* Accent Line with gradient animation */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${classes.bg} opacity-30 transition-all duration-500 hover:opacity-50`} />
      </div>
    </motion.div>
  );
};

export default StatCard;
