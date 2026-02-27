'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Tecnico, storageApi } from '@/lib/api';

// Esquema de validación para Técnico
const tecnicoSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  especialidad: z.enum(['XR', 'CT', 'MR', 'US', 'MG', 'PET/CT', 'Multi-mod', 'DEXA', 'RF', 'CATH']).optional(),
  certificaciones: z.string()
    .max(500, 'Las certificaciones no pueden exceder 500 caracteres')
    .optional(),
  telefono: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Formato de teléfono inválido')
    .optional(),
  email: z.string()
    .email('Formato de email inválido')
    .or(z.literal(''))
    .optional(),
  base_ciudad: z.string()
    .max(100, 'La ciudad base no puede exceder 100 caracteres')
    .optional(),
  activo: z.boolean(),
  avatar_url: z.string().optional(),
});

type TecnicoFormData = z.infer<typeof tecnicoSchema>;

interface TecnicoFormProps {
  tecnico?: Tecnico;
  onSubmit: (data: TecnicoFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const especialidadOptions = [
  { value: 'XR', label: 'Rayos X (XR)' },
  { value: 'CT', label: 'Tomografía Computarizada (CT)' },
  { value: 'MR', label: 'Resonancia Magnética (MR)' },
  { value: 'US', label: 'Ultrasonido (US)' },
  { value: 'MG', label: 'Mamografía (MG)' },
  { value: 'PET/CT', label: 'PET/CT' },
  { value: 'Multi-mod', label: 'Multi-modalidad' },
  { value: 'DEXA', label: 'Densitometría (DEXA)' },
  { value: 'RF', label: 'Fluoroscopía (RF)' },
  { value: 'CATH', label: 'Cateterismo (CATH)' },
];

// Estados de México
const estadosMexico = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
];

export const TecnicoForm: React.FC<TecnicoFormProps> = ({
  tecnico,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TecnicoFormData>({
    resolver: zodResolver(tecnicoSchema),
    defaultValues: tecnico ? {
      nombre: tecnico.nombre,
      especialidad: tecnico.especialidad,
      certificaciones: tecnico.certificaciones || '',
      telefono: tecnico.telefono || '',
      email: tecnico.email || '',
      base_ciudad: tecnico.base_ciudad || '',
      activo: tecnico.activo === 1 || tecnico.activo === undefined,
      avatar_url: tecnico.avatar_url || ''
    } : {
      nombre: '',
      especialidad: undefined,
      certificaciones: '',
      telefono: '',
      email: '',
      base_ciudad: '',
      activo: true,
      avatar_url: ''
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await storageApi.uploadImage(file, 'imagenes_equipo');
      if (res.data.success) {
        setValue('avatar_url', res.data.url, { shouldDirty: true });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onFormSubmit = async (data: TecnicoFormData) => {
    try {
      await onSubmit(data);
      if (!tecnico) {
        reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="form-container"
    >
      <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-6 p-6">
        {/* Información Personal */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {tecnico ? 'Editar Técnico' : 'Nuevo Técnico'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Foto del Técnico */}
            <div className="md:col-span-2 flex items-center mb-4">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar
                  src={watch('avatar_url')}
                  fallback={watch('nombre')}
                  size="xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              <div className="ml-6 flex items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Foto del Técnico</h4>
                  <p className="text-xs text-gray-500 mt-1">Sube una imagen para identificar a este técnico.</p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3 text-sm py-1"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isSubmitting || isLoading}
                  >
                    {isUploading ? 'Subiendo...' : 'Elegir foto'}
                  </Button>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">
                Nombre Completo *
              </label>
              <input
                {...register('nombre')}
                type="text"
                className={`input-field ${errors.nombre ? 'border-red-500' : ''}`}
                placeholder="Juan Pérez Martínez"
              />
              {errors.nombre && (
                <p className="form-error">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Especialidad
              </label>
              <select
                {...register('especialidad')}
                className={`input-field ${errors.especialidad ? 'border-red-500' : ''}`}
              >
                <option value="">Seleccionar especialidad</option>
                {especialidadOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.especialidad && (
                <p className="form-error">{errors.especialidad.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Estado/Ciudad Base
              </label>
              <select
                {...register('base_ciudad')}
                className={`input-field ${errors.base_ciudad ? 'border-red-500' : ''}`}
              >
                <option value="">Seleccionar estado...</option>
                {estadosMexico.map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              {errors.base_ciudad && (
                <p className="form-error">{errors.base_ciudad.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Teléfono
              </label>
              <input
                {...register('telefono')}
                type="tel"
                className={`input-field ${errors.telefono ? 'border-red-500' : ''}`}
                placeholder="+52-55-1234-5678"
              />
              {errors.telefono && (
                <p className="form-error">{errors.telefono.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="tecnico@empresa.com"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="form-label">
                Certificaciones
              </label>
              <textarea
                {...register('certificaciones')}
                className={`input-field resize-none ${errors.certificaciones ? 'border-red-500' : ''}`}
                placeholder="Certificaciones, cursos, capacitaciones especializadas..."
                rows={3}
                maxLength={500}
              />
              {errors.certificaciones && (
                <p className="form-error">{errors.certificaciones.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  {...register('activo')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Técnico activo
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Los técnicos inactivos no aparecerán en las asignaciones de órdenes
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
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
            {isSubmitting || isLoading ? 'Guardando...' : (tecnico ? 'Actualizar' : 'Crear')}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};