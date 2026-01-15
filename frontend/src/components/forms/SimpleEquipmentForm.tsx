
'use client';
import { mapEstadoEquipoToUI } from '@/lib/mappers';

import React, { useEffect, useState } from 'react';
import { clientesService } from '@/services/clientesService';
import { fabricantesService } from '@/services/fabricantesService';
import { modalidadesService } from '@/services/modalidadesService';
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
  fabricante_id: z.number().int().positive('Selecciona un fabricante'),
  modalidad_id: z.number().int().positive('Selecciona una modalidad'),
  cliente_id: z.number().int().positive('Selecciona un cliente'),
  estado: z.enum(['operativo', 'mantenimiento', 'fuera-servicio']),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  fechaInstalacion: z.string().optional(),
  ultimaCalibacion: z.string().optional(),
  proximaCalibacion: z.string().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

type CatalogOption = { fabricante_id?: number; nombre?: string; modalidad_id?: number; codigo?: string; descripcion?: string; cliente_id?: number };

interface SimpleEquipmentFormProps {
  equipment?: any; // Equipo a editar (opcional)
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SimpleEquipmentForm: React.FC<SimpleEquipmentFormProps> = ({
  equipment,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [clientes, setClientes] = useState<CatalogOption[]>([]);
  const [fabricantes, setFabricantes] = useState<CatalogOption[]>([]);
  const [modalidades, setModalidades] = useState<CatalogOption[]>([]);

  useEffect(() => {
    clientesService.getAllForDropdown().then(({ data }) => setClientes(data || []));
    fabricantesService.getAll().then(({ data }) => setFabricantes(data || []));
    modalidadesService.getAll().then(({ data }) => setModalidades(data || []));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: equipment ? {
      modelo: equipment.modelo || '',
      numeroSerie: equipment.numeroSerie || '',
      fabricante_id: equipment.fabricante_id || 0,
      modalidad_id: equipment.modalidad_id || 0,
      cliente_id: equipment.cliente_id || 0,
      estado: equipment.estado || 'operativo',
      ubicacion: equipment.ubicacion || '',
      fechaInstalacion: equipment.fechaInstalacion || new Date().toISOString().split('T')[0],
      ultimaCalibacion: equipment.ultimaCalibacion || new Date().toISOString().split('T')[0],
      proximaCalibacion: equipment.proximaCalibacion || new Date().toISOString().split('T')[0],
    } : {
      modelo: '',
      numeroSerie: '',
      fabricante_id: 0,
      modalidad_id: 0,
      cliente_id: 0,
      estado: 'operativo',
      ubicacion: '',
      fechaInstalacion: new Date().toISOString().split('T')[0],
      ultimaCalibacion: new Date().toISOString().split('T')[0],
      proximaCalibacion: new Date().toISOString().split('T')[0],
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
              placeholder="Ej: 123456789"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fabricante
              </label>
              <select
                {...register('fabricante_id', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Seleccionar fabricante</option>
                {fabricantes.map(fab => (
                  <option key={fab.fabricante_id} value={fab.fabricante_id}>{fab.nombre}</option>
                ))}
              </select>
              {errors.fabricante_id && (
                <p className="text-red-500 text-sm mt-1">{errors.fabricante_id.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidad
              </label>
              <select
                {...register('modalidad_id', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Seleccionar modalidad</option>
                {modalidades.map(mod => (
                  <option key={mod.modalidad_id} value={mod.modalidad_id}>{mod.codigo} - {mod.descripcion}</option>
                ))}
              </select>
              {errors.modalidad_id && (
                <p className="text-red-500 text-sm mt-1">{errors.modalidad_id.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                {...register('cliente_id', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Seleccionar cliente</option>
                {clientes.map(cli => (
                  <option key={cli.cliente_id} value={cli.cliente_id}>{cli.nombre}</option>
                ))}
              </select>
              {errors.cliente_id && (
                <p className="text-red-500 text-sm mt-1">{errors.cliente_id.message}</p>
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
        {/* Fechas Importantes */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            📅 Fechas Importantes
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
            variant="secondary"
            disabled={isSubmitting || isLoading}
            className="!text-gray-900"
            style={{ color: '#1a1a1a' }}
          >
            {isSubmitting
              ? (equipment ? 'Guardando...' : 'Creando...')
              : (equipment ? 'Guardar Cambios' : 'Crear Equipo')
            }
          </Button>
        </div>
      </form>
    </div>
  );
};