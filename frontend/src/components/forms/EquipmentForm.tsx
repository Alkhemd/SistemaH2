'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Equipment } from '@/lib/api';
import { 
  CubeIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const equipmentSchema = z.object({
  modelo: z.string().min(1, 'El modelo es requerido'),
  numeroSerie: z.string().min(1, 'El número de serie es requerido'),
  fabricante: z.string().min(1, 'El fabricante es requerido'),
  modalidad: z.string().min(1, 'La modalidad es requerida'),
  cliente: z.string().min(1, 'El cliente es requerido'),
  estado: z.enum(['operativo', 'mantenimiento', 'fuera-servicio']),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  fechaInstalacion: z.string().min(1, 'La fecha de instalación es requerida'),
  ultimaCalibacion: z.string().min(1, 'La fecha de última calibración es requerida'),
  proximaCalibacion: z.string().min(1, 'La fecha de próxima calibración es requerida'),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const modalidades = [
  'Tomografía Computarizada',
  'Resonancia Magnética',
  'Radiografía',
  'Ultrasonido',
  'Mamografía',
  'Fluoroscopia',
  'Medicina Nuclear',
  'Radioterapia'
];

const estados = [
  { value: 'operativo', label: 'Operativo', color: 'green' },
  { value: 'mantenimiento', label: 'En Mantenimiento', color: 'yellow' },
  { value: 'fuera-servicio', label: 'Fuera de Servicio', color: 'red' }
];

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  equipment,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: equipment ? {
      modelo: equipment.modelo || '',
      numeroSerie: equipment.numero_serie || '',
      fabricante: 'General Electric',
      modalidad: 'CT',
      cliente: 'Hospital General',
      estado: 'operativo',
      ubicacion: equipment.ubicacion || '',
      fechaInstalacion: new Date().toISOString().split('T')[0],
      ultimaCalibacion: new Date().toISOString().split('T')[0],
      proximaCalibacion: new Date().toISOString().split('T')[0],
    } : {
      modelo: '',
      numeroSerie: '',
      fabricante: 'General Electric',
      modalidad: 'CT',
      cliente: 'Hospital General',
      estado: 'operativo',
      ubicacion: '',
      fechaInstalacion: new Date().toISOString().split('T')[0],
      ultimaCalibacion: new Date().toISOString().split('T')[0],
      proximaCalibacion: new Date().toISOString().split('T')[0],
    }
  });

  const watchedEstado = watch('estado');

  const handleFormSubmit = async (data: EquipmentFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {equipment ? 'Editar Equipo' : 'Nuevo Equipo'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {equipment ? 'Actualiza la información del equipo' : 'Ingresa los datos del nuevo equipo médico'}
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Básica */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <CubeIcon className="w-5 h-5 text-primary-500" />
            Información Básica
          </h4>
          
          <Input
            label="Modelo"
            {...register('modelo')}
            error={errors.modelo?.message}
            placeholder="Ej: Discovery CT750 HD"
          />
          
          <Input
            label="Número de Serie"
            {...register('numeroSerie')}
            error={errors.numeroSerie?.message}
            placeholder="Ej: CT750-2023-001"
          />
          
          <Input
            label="Fabricante"
            {...register('fabricante')}
            error={errors.fabricante?.message}
            placeholder="Ej: General Electric"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Modalidad
            </label>
            <select
              {...register('modalidad')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Seleccionar modalidad</option>
              {modalidades.map((modalidad) => (
                <option key={modalidad} value={modalidad}>
                  {modalidad}
                </option>
              ))}
            </select>
            {errors.modalidad && (
              <p className="text-sm text-red-600">{errors.modalidad.message}</p>
            )}
          </div>
        </div>

        {/* Ubicación y Cliente */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <BuildingOfficeIcon className="w-5 h-5 text-primary-500" />
            Ubicación y Cliente
          </h4>
          
          <Input
            label="Cliente"
            {...register('cliente')}
            error={errors.cliente?.message}
            placeholder="Ej: Hospital General de México"
          />
          
          <Input
            label="Ubicación"
            {...register('ubicacion')}
            error={errors.ubicacion?.message}
            placeholder="Ej: Sala de Tomografía - Piso 2"
            icon={<MapPinIcon className="w-4 h-4" />}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <div className="grid grid-cols-1 gap-2">
              {estados.map((estado) => (
                <label
                  key={estado.value}
                  className={`
                    flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${watchedEstado === estado.value 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    {...register('estado')}
                    value={estado.value}
                    className="sr-only"
                  />
                  <div className={`
                    w-3 h-3 rounded-full mr-3
                    ${estado.color === 'green' ? 'bg-green-500' : 
                      estado.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}
                  `} />
                  <span className="font-medium text-gray-900">{estado.label}</span>
                </label>
              ))}
            </div>
            {errors.estado && (
              <p className="text-sm text-red-600">{errors.estado.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-500" />
          Fechas Importantes
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Fecha de Instalación"
            type="date"
            {...register('fechaInstalacion')}
            error={errors.fechaInstalacion?.message}
          />
          
          <Input
            label="Última Calibración"
            type="date"
            {...register('ultimaCalibacion')}
            error={errors.ultimaCalibacion?.message}
          />
          
          <Input
            label="Próxima Calibración"
            type="date"
            {...register('proximaCalibacion')}
            error={errors.proximaCalibacion?.message}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          {equipment ? 'Actualizar' : 'Crear'} Equipo
        </Button>
      </div>
    </motion.form>
  );
};
