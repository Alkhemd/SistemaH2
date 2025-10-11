import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'operativo':
    case 'activo':
    case 'completada':
    case 'cerrada':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'mantenimiento':
    case 'proceso':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'fuera-servicio':
    case 'inactivo':
    case 'abierta':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'critica':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'alta':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'normal':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getPriorityIcon(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'critica':
      return '🔴';
    case 'alta':
      return '🟠';
    case 'normal':
      return '🟢';
    default:
      return '⚪';
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
