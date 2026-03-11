import { motion } from 'framer-motion';
import {
  User,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export interface Activity {
  id: string | number;
  type: string;
  description: string;
  timestamp: string;
  time: string;
  fullTime?: string;
  status: string;
  equipment?: string;
  client?: string;
  usuario?: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
  showTitle?: boolean;
  limit?: number;
}

const ActivityTimeline = ({ activities, showTitle = true, limit }: ActivityTimelineProps) => {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cerrada':
      case 'Completada':
      case 'INSERT':
        return 'bg-green-500';
      case 'En Proceso':
      case 'Asignada':
      case 'UPDATE':
        return 'bg-yellow-500';
      case 'DELETE':
      case 'Alarma':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getBadgeStyles = (type: string, status: string) => {
    const isUrgent = type === 'Crítica' || type === 'Alta';
    const isSuccess = status === 'Cerrada' || status === 'Completada' || status === 'INSERT';
    const isWarning = status === 'En Proceso' || status === 'Asignada' || status === 'UPDATE';

    return {
      type: `inline-block px-3 py-1 rounded-full text-xs font-medium neuro-convex-sm ${isUrgent ? 'text-red-600' : type === 'Media' ? 'text-yellow-600' : 'text-green-600'
        }`,
      status: `inline-block px-3 py-1 rounded-full text-xs font-medium neuro-convex-sm ${isSuccess ? 'text-green-600 bg-green-50' : isWarning ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
        }`
    };
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold neuro-text-primary">
            Actividad Reciente
          </h2>
          <Link href="/historial" className="neuro-button px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-2">
            <span>Ver todo</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {displayActivities && displayActivities.length > 0 ? (
          displayActivities.map((activity, index) => {
            const badgeStyles = getBadgeStyles(activity.type, activity.status);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 neuro-convex-sm hover:neuro-concave-sm rounded-xl transition-all duration-200"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(activity.status)} shadow-sm`} />
                  <div className="truncate">
                    <p className="font-medium neuro-text-primary truncate">
                      {activity.equipment || activity.description || 'Actividad del sistema'}
                    </p>
                    <p className="text-sm neuro-text-secondary truncate">
                      {activity.client ? `${activity.client} • ` : ''}{activity.description}
                    </p>
                    {activity.usuario && (
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <User size={10} className="mr-1" />
                        <span>{activity.usuario}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end flex-shrink-0 ml-4 space-y-1">
                  <div className="flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    <Clock size={12} className="mr-1" />
                    <span>{activity.time}</span>
                  </div>
                  {activity.fullTime && (
                    <div className="text-[10px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 italic">
                      {activity.fullTime}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={badgeStyles.status}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 neuro-convex-sm rounded-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-gray-400" />
            </div>
            <p className="neuro-text-secondary font-medium">
              No hay actividad reciente
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
