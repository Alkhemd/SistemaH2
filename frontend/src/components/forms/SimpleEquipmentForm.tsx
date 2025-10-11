'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Schema simplificado para el formulario
const equipmentSchema = z.object({
  modelo: z.string().min(1, 'El modelo es requerido'),
  numeroSerie: z.string().min(1, 'El número de serie es requerido'),
  fabricante: z.string().min(1, 'El fabricante es requerido'),
  modalidad: z.string().min(1, 'La modalidad es requerida'),
  cliente: z.string().min(1, 'El cliente es requerido'),
  estado: z.enum(['operativo', 'mantenimiento', 'fuera-servicio']),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface SimpleEquipmentFormProps {
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SimpleEquipmentForm: React.FC<SimpleEquipmentFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      modelo: '',
      numeroSerie: '',
      fabricante: '',
      modalidad: '',
      cliente: '',
      estado: 'operativo',
      ubicacion: ''
    }
  });

  const handleFormSubmit = async (data: EquipmentFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="bg-white form-container">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Nuevo Equipo Médico
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Ingresa los datos del nuevo equipo médico
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Modelo"
              {...register('modelo')}
              error={errors.modelo?.message}
              placeholder="Ej: GE Discovery CT750 HD"
            />
            
            <Input
              label="Número de Serie"
              {...register('numeroSerie')}
              error={errors.numeroSerie?.message}
              placeholder="Ej: CT750-2023-001"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fabricante
              </label>
              <select
                {...register('fabricante')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar fabricante</option>
                <option value="General Electric">General Electric</option>
                <option value="Siemens">Siemens</option>
                <option value="Philips">Philips</option>
                <option value="Canon">Canon</option>
              </select>
              {errors.fabricante && (
                <p className="text-red-500 text-sm mt-1">{errors.fabricante.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidad
              </label>
              <select
                {...register('modalidad')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar modalidad</option>
                <option value="CT">Tomografía Computarizada (CT)</option>
                <option value="MR">Resonancia Magnética (MR)</option>
                <option value="XR">Rayos X (XR)</option>
                <option value="US">Ultrasonido (US)</option>
                <option value="MG">Mamografía (MG)</option>
              </select>
              {errors.modalidad && (
                <p className="text-red-500 text-sm mt-1">{errors.modalidad.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                {...register('cliente')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar cliente</option>
                <option value="Hospital General de México">Hospital General de México</option>
                <option value="Hospital ABC">Hospital ABC</option>
                <option value="Clínica San Rafael">Clínica San Rafael</option>
                <option value="Centro Médico Nacional">Centro Médico Nacional</option>
              </select>
              {errors.cliente && (
                <p className="text-red-500 text-sm mt-1">{errors.cliente.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                {...register('estado')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="operativo">Operativo</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="fuera-servicio">Fuera de Servicio</option>
              </select>
              {errors.estado && (
                <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>
              )}
            </div>
          </div>
        </div>

        <Input
          label="Ubicación"
          {...register('ubicacion')}
          error={errors.ubicacion?.message}
          placeholder="Ej: Sala de Tomografía - Piso 2"
        />

        {/* Action Buttons */}
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
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Creando...' : 'Crear Equipo'}
          </Button>
        </div>
      </form>
    </div>
  );
};