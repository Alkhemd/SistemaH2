'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Calendar, 
  Shield, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Wrench,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Mock data - En producción esto vendría de la API
const mockEquipmentDetail = {
  id: '1',
  modelo: 'Discovery CT750 HD',
  numeroSerie: '12345ABC',
  fabricante: 'GE Healthcare',
  modalidad: 'Tomografía Computarizada',
  cliente: 'Hospital San José',
  estado: 'operativo' as const,
  ubicacion: 'Hospital San José - Sala de Tomografía 3',
  fechaInstalacion: '15 Enero 2020',
  ultimaCalibacion: '15 Marzo 2024',
  proximaCalibacion: '15 Marzo 2025',
  garantia: {
    tipo: 'Cobertura Total Plus',
    vigencia: '01 Ene 2024 - 31 Dic 2024',
    tiempoRespuesta: '4 horas'
  },
  especificaciones: {
    año: '2020',
    voltaje: '380V',
    frecuencia: '50Hz',
    potencia: '100kW'
  }
};

const mockOrders = [
  {
    id: 'ORD-2401',
    tipo: 'Correctivo',
    prioridad: 'critica' as const,
    estado: 'abierta' as const,
    titulo: 'Falla en el sistema de enfriamiento',
    descripcion: 'El sistema de enfriamiento presenta temperaturas elevadas que pueden afectar el funcionamiento del equipo.',
    fechaCreacion: '08 Oct 2024',
    tecnico: 'Juan Pérez',
    tiempoEstimado: '4 horas'
  },
  {
    id: 'ORD-2398',
    tipo: 'Preventivo',
    prioridad: 'normal' as const,
    estado: 'completada' as const,
    titulo: 'Mantenimiento preventivo trimestral',
    descripcion: 'Mantenimiento preventivo programado según cronograma anual.',
    fechaCreacion: '01 Oct 2024',
    fechaCompletado: '02 Oct 2024',
    tecnico: 'María González',
    tiempoEstimado: '2 horas'
  },
  {
    id: 'ORD-2395',
    tipo: 'Calibración',
    prioridad: 'alta' as const,
    estado: 'proceso' as const,
    titulo: 'Calibración anual de precisión',
    descripcion: 'Calibración anual requerida para mantener la precisión diagnóstica.',
    fechaCreacion: '28 Sep 2024',
    tecnico: 'Carlos Ruiz',
    tiempoEstimado: '6 horas'
  }
];

const mockMaintenances = [
  {
    id: 'MANT-2024-Q3',
    tipo: 'Preventivo',
    fecha: '02 Oct 2024',
    tecnico: 'María González',
    duracion: '2 horas',
    actividades: ['Limpieza general', 'Verificación de calibración', 'Pruebas de funcionamiento'],
    estado: 'completado'
  },
  {
    id: 'MANT-2024-Q2',
    tipo: 'Preventivo',
    fecha: '15 Jul 2024',
    tecnico: 'Juan Pérez',
    duracion: '2.5 horas',
    actividades: ['Mantenimiento de software', 'Limpieza de componentes', 'Verificación de seguridad'],
    estado: 'completado'
  }
];

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>('orders');

  const equipment = mockEquipmentDetail; // En producción: fetch basado en params.id

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'operativo':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'mantenimiento':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'fuera-servicio':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica':
        return 'bg-red-50 text-red-600';
      case 'alta':
        return 'bg-orange-50 text-orange-600';
      case 'normal':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getOrderStatusColor = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return 'bg-red-50 text-red-600';
      case 'proceso':
        return 'bg-yellow-50 text-yellow-600';
      case 'completada':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const Section = ({ 
    title, 
    count, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    count?: number; 
    sectionKey: string; 
    children: React.ReactNode; 
  }) => {
    const isExpanded = expandedSection === sectionKey;
    
    return (
      <div className="card">
        <button
          onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
          className="w-full flex items-center justify-between p-0 mb-4"
        >
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold text-[#1D1D1F]">{title}</h3>
            {count !== undefined && (
              <span className="bg-[#0071E3] text-white text-sm px-2 py-1 rounded-full">
                {count}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#0071E3] hover:text-[#0077ED] font-medium text-sm">
              {isExpanded ? 'Ocultar' : 'Ver todos'} →
            </span>
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        </button>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={20} className="text-[#6E6E73]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#1D1D1F]">
              {equipment.fabricante} {equipment.modelo}
            </h1>
            <p className="text-[#6E6E73] mt-1">
              S/N: {equipment.numeroSerie}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-full border font-medium ${getStatusColor(equipment.estado)}`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                equipment.estado === 'operativo' ? 'bg-green-500' :
                equipment.estado === 'mantenimiento' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="capitalize">{equipment.estado}</span>
            </div>
          </div>
          
          <button className="btn-primary flex items-center space-x-2">
            <Edit size={18} />
            <span>Editar</span>
          </button>
        </div>
      </motion.div>

      {/* Equipment Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Basic Info */}
        <div className="lg:col-span-2 card">
          <h3 className="text-xl font-semibold text-[#1D1D1F] mb-4">
            Información Técnica
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-[#86868B] text-sm">Fabricante</span>
                <p className="font-medium text-[#1D1D1F]">{equipment.fabricante}</p>
              </div>
              <div>
                <span className="text-[#86868B] text-sm">Modalidad</span>
                <p className="font-medium text-[#1D1D1F]">{equipment.modalidad}</p>
              </div>
              <div>
                <span className="text-[#86868B] text-sm">Año</span>
                <p className="font-medium text-[#1D1D1F]">{equipment.especificaciones.año}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-[#86868B] text-sm">Fecha de Instalación</span>
                <p className="font-medium text-[#1D1D1F]">{equipment.fechaInstalacion}</p>
              </div>
              <div>
                <span className="text-[#86868B] text-sm">Última Calibración</span>
                <p className="font-medium text-[#1D1D1F]">{equipment.ultimaCalibacion}</p>
              </div>
              <div>
                <span className="text-[#86868B] text-sm">Próxima Calibración</span>
                <p className="font-medium text-[#1D1D1F]">{equipment.proximaCalibacion}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-[#6E6E73] mb-2">
              <MapPin size={16} />
              <span className="font-medium">Ubicación</span>
            </div>
            <p className="text-[#1D1D1F]">{equipment.ubicacion}</p>
          </div>
        </div>

        {/* Contract Info */}
        <div className="card">
          <h3 className="text-xl font-semibold text-[#1D1D1F] mb-4">
            Contrato Activo
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Shield size={16} className="text-[#0071E3]" />
                <span className="font-medium text-[#0071E3]">{equipment.garantia.tipo}</span>
              </div>
              <p className="text-sm text-[#6E6E73]">
                Vigencia: {equipment.garantia.vigencia}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-[#6E6E73]">
              <Clock size={16} />
              <span>Respuesta: {equipment.garantia.tiempoRespuesta}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Section title="Órdenes de Trabajo" count={mockOrders.length} sectionKey="orders">
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-[#6E6E73]">#{order.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.prioridad)}`}>
                      {order.prioridad}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.estado)}`}>
                      {order.estado}
                    </span>
                  </div>
                  <span className="text-sm text-[#86868B]">{order.fechaCreacion}</span>
                </div>
                
                <h4 className="font-semibold text-[#1D1D1F] mb-2">{order.titulo}</h4>
                <p className="text-[#6E6E73] text-sm mb-3">{order.descripcion}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#86868B]">Técnico: {order.tecnico}</span>
                  <span className="text-[#86868B]">Est: {order.tiempoEstimado}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </motion.div>

      {/* Maintenance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Section title="Mantenimientos Preventivos" count={mockMaintenances.length} sectionKey="maintenance">
          <div className="space-y-4">
            {mockMaintenances.map((maintenance) => (
              <div key={maintenance.id} className="p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="font-medium text-[#1D1D1F]">{maintenance.tipo}</span>
                  </div>
                  <span className="text-sm text-[#86868B]">{maintenance.fecha}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-[#86868B] text-sm">Técnico</span>
                    <p className="font-medium text-[#1D1D1F]">{maintenance.tecnico}</p>
                  </div>
                  <div>
                    <span className="text-[#86868B] text-sm">Duración</span>
                    <p className="font-medium text-[#1D1D1F]">{maintenance.duracion}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-[#86868B] text-sm">Actividades realizadas</span>
                  <ul className="mt-1 space-y-1">
                    {maintenance.actividades.map((actividad, index) => (
                      <li key={index} className="text-sm text-[#6E6E73] flex items-center space-x-2">
                        <div className="w-1 h-1 bg-[#86868B] rounded-full" />
                        <span>{actividad}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </motion.div>
    </div>
  );
}
