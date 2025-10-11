'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Wrench,
  FileText
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'completed' | 'warning' | 'pending' | 'maintenance' | 'created';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-[#34C759]', bg: 'bg-green-50' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-[#FF9500]', bg: 'bg-orange-50' };
      case 'pending':
        return { icon: Clock, color: 'text-[#007AFF]', bg: 'bg-blue-50' };
      case 'maintenance':
        return { icon: Wrench, color: 'text-[#6E6E73]', bg: 'bg-gray-50' };
      case 'created':
        return { icon: FileText, color: 'text-[#0071E3]', bg: 'bg-blue-50' };
      default:
        return { icon: Clock, color: 'text-[#6E6E73]', bg: 'bg-gray-50' };
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#1D1D1F]">
          Actividad Reciente
        </h3>
        <button className="text-[#0071E3] hover:text-[#0077ED] font-medium text-sm transition-colors duration-200">
          Ver todas →
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const { icon: Icon, color, bg } = getActivityIcon(activity.type);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg ${bg} flex-shrink-0`}>
                <Icon size={16} className={color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-[#1D1D1F] truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-[#86868B] flex-shrink-0 ml-2">
                    {activity.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-[#6E6E73] mt-1 line-clamp-2">
                  {activity.description}
                </p>
                
                {activity.user && (
                  <div className="flex items-center mt-2 text-xs text-[#86868B]">
                    <User size={12} className="mr-1" />
                    {activity.user}
                  </div>
                )}
              </div>

              {/* Timeline Line */}
              {index < activities.length - 1 && (
                <div className="absolute left-8 mt-12 w-px h-8 bg-gray-200" />
              )}
            </motion.div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={24} className="text-[#86868B]" />
          </div>
          <p className="text-[#6E6E73] font-medium">
            No hay actividad reciente
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
