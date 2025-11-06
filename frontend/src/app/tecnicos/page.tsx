'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TecnicoForm } from '@/components/forms/TecnicoForm';
import { useTecnicos } from '@/hooks/useCatalogs';
import { SkeletonCard } from '@/components/ui/Skeleton';

const especialidadLabels = {
  'XR': 'Rayos X',
  'CT': 'Tomografía',
  'MR': 'Resonancia',
  'US': 'Ultrasonido',
  'MG': 'Mamografía',
  'PET/CT': 'PET/CT',
  'Multi-mod': 'Multi-modalidad',
  'DEXA': 'DEXA',
  'RF': 'Fluoroscopía',
  'CATH': 'Cateterismo'
};

export default function TecnicosPage() {
  const { tecnicos, isLoading, createTecnico, updateTecnico, deleteTecnico } = useTecnicos();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filtrar técnicos con useMemo para optimizar
  const filteredTecnicos = useMemo(() => {
    if (!searchTerm) return tecnicos;
    
    const term = searchTerm.toLowerCase();
    return tecnicos.filter(tecnico =>
      tecnico.nombre?.toLowerCase().includes(term) ||
      tecnico.especialidad?.toLowerCase().includes(term) ||
      tecnico.base_ciudad?.toLowerCase().includes(term)
    );
  }, [tecnicos, searchTerm]);

  // Manejar creación
  const handleCreateTecnico = async (data: any) => {
    try {
      await createTecnico({
        nombre: data.nombre,
        especialidad: data.especialidad,
        certificaciones: data.certificaciones,
        telefono: data.telefono,
        email: data.email,
        base_ciudad: data.base_ciudad,
        activo: data.activo ? 1 : 0
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error al crear técnico:', error);
    }
  };

  // Manejar edición
  const handleEditTecnico = async (data: any) => {
    if (!selectedTecnico) return;
    
    try {
      await updateTecnico(parseInt(selectedTecnico.id), {
        nombre: data.nombre,
        especialidad: data.especialidad,
        certificaciones: data.certificaciones,
        telefono: data.telefono,
        email: data.email,
        base_ciudad: data.base_ciudad,
        activo: data.activo ? 1 : 0
      });
      setIsEditModalOpen(false);
      setSelectedTecnico(null);
    } catch (error) {
      console.error('Error al editar técnico:', error);
    }
  };

  const handleViewTecnico = (tecnico: any) => {
    setSelectedTecnico(tecnico);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (tecnico: any) => {
    setSelectedTecnico(tecnico);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold neuro-text-primary mb-2">
          Técnicos
        </h1>
        <p className="text-lg neuro-text-secondary mb-4">
          Gestión de técnicos especializados
        </p>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="neuro-button-white"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Técnico</span>
        </Button>
      </div>

      {/* Controles */}
      <div className="neuro-card-soft p-8 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <MagnifyingGlassIcon className="w-5 h-5 neuro-text-secondary" />
          <h3 className="font-semibold neuro-text-primary text-base">Búsqueda</h3>
        </div>
        <div className="neuro-input-wrapper">
          <MagnifyingGlassIcon className="w-5 h-5 neuro-text-tertiary absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Buscar técnicos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neuro-input pl-14"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="neuro-text-tertiary text-sm">
        {filteredTecnicos.length} técnicos encontrados
      </p>

      {/* Lista de técnicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Mostrar skeletons mientras carga
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTecnicos.map((tecnico, index) => (
            <motion.div
              key={tecnico.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => handleViewTecnico(tecnico)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      tecnico.activo ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <UserIcon className={`w-6 h-6 ${
                        tecnico.activo ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {tecnico.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">{tecnico.base_ciudad}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tecnico.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tecnico.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Especialidad:</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                      {especialidadLabels[tecnico.especialidad as keyof typeof especialidadLabels] || tecnico.especialidad}
                    </span>
                  </div>

                  {tecnico.certificaciones && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Certificaciones:</p>
                      <p className="text-sm text-gray-600">{tecnico.certificaciones}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Email:</span>
                    <span className="font-semibold text-xs truncate ml-2">{tecnico.email || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(tecnico);
                    }}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        )}
      </div>

      {!isLoading && filteredTecnicos.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron técnicos
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando un nuevo técnico'}
          </p>
        </div>
      )}

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Técnico"
      >
        <TecnicoForm
          onSubmit={handleCreateTecnico}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTecnico(null);
        }}
        title="Editar Técnico"
      >
        <TecnicoForm
          tecnico={selectedTecnico}
          onSubmit={handleEditTecnico}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedTecnico(null);
          }}
        />
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTecnico(null);
        }}
        title="Detalles del Técnico"
      >
        {selectedTecnico && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <p className="text-gray-900">{selectedTecnico.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <p className="text-gray-900">
                  {especialidadLabels[selectedTecnico.especialidad as keyof typeof especialidadLabels] || selectedTecnico.especialidad}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad Base
                </label>
                <p className="text-gray-900">{selectedTecnico.base_ciudad}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedTecnico.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedTecnico.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <p className="text-gray-900">{selectedTecnico.telefono}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{selectedTecnico.email}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificaciones
                </label>
                <p className="text-gray-900">{selectedTecnico.certificaciones || 'No especificadas'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                Editar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}