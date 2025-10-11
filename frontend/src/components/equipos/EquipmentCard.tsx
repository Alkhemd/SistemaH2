'use client';

import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Monitor, 
  Zap, 
  Heart, 
  Eye,
  Scan,
  MapPin,
  Calendar
} from 'lucide-react';

interface Equipment {
  id: string;
  modelo: string;
  numeroSerie: string;
  fabricante: string;
  modalidad: string;
  cliente: string;
  estado: 'operativo' | 'mantenimiento' | 'fuera-servicio';
  ubicacion?: string;
  ultimaCalibacion?: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
  onClick?: () => void;
}

const EquipmentCard = ({ equipment, onClick }: EquipmentCardProps) => {
  const getModalityIcon = (modalidad: string) => {
    switch (modalidad.toLowerCase()) {
      case 'tomografia':
      case 'ct':
        return Scan;
      case 'resonancia':
      case 'mri':
        return Monitor;
      case 'rayos x':
      case 'radiografia':
        return Zap;
      case 'ultrasonido':
        return Heart;
      case 'endoscopia':
        return Eye;
      default:
        return Stethoscope;
    }
  };

  const getStatusColor = (estado: Equipment['estado']) => {
    switch (estado) {
      case 'operativo':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          dot: 'bg-green-500'
        };
      case 'mantenimiento':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-600',
          dot: 'bg-yellow-500'
        };
      case 'fuera-servicio':
        return {
          bg: 'bg-red-50',
          text: 'text-red-600',
          dot: 'bg-red-500'
        };
    }
  };

  const Icon = getModalityIcon(equipment.modalidad);
  const statusColors = getStatusColor(equipment.estado);

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="equipment-card group cursor-pointer"
    >
      {/* Icon/Image Section */}
      <div className="flex justify-center mb-6">
        <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
          <Icon size={48} className="text-[#0071E3]" />
        </div>
      </div>

      {/* Equipment Info */}
      <div className="space-y-3">
        {/* Model */}
        <h3 className="text-lg font-semibold text-[#1D1D1F] text-center truncate">
          {equipment.modelo}
        </h3>

        {/* Serial Number */}
        <p className="text-sm text-[#6E6E73] text-center font-mono">
          S/N: {equipment.numeroSerie}
        </p>

        {/* Manufacturer */}
        <p className="text-sm text-[#86868B] text-center">
          {equipment.fabricante}
        </p>

        {/* Client */}
        <div className="flex items-center justify-center space-x-1 text-sm text-[#86868B]">
          <MapPin size={12} />
          <span className="truncate">{equipment.cliente}</span>
        </div>

        {/* Location */}
        {equipment.ubicacion && (
          <p className="text-xs text-[#86868B] text-center truncate">
            {equipment.ubicacion}
          </p>
        )}

        {/* Last Calibration */}
        {equipment.ultimaCalibacion && (
          <div className="flex items-center justify-center space-x-1 text-xs text-[#86868B]">
            <Calendar size={10} />
            <span>Últ. cal: {equipment.ultimaCalibacion}</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-4 flex justify-center">
        <div className={`
          inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium
          ${statusColors.bg} ${statusColors.text}
        `}>
          <div className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
          <span className="capitalize">
            {equipment.estado.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </motion.div>
  );
};

export default EquipmentCard;
