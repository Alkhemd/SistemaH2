'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BuildingOfficeIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { FabricanteForm } from '@/components/forms/FabricanteForm';
import { useFabricantes } from '@/hooks/useCatalogs';
import { SkeletonCard } from '@/components/ui/Skeleton';

export default function FabricantesPage() {
  const { fabricantes, isLoading, createFabricante, updateFabricante, deleteFabricante } = useFabricantes();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFabricante, setSelectedFabricante] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filtrar fabricantes con useMemo para optimizar
  const filteredFabricantes = useMemo(() => {
    if (!searchTerm) return fabricantes;
    
    const term = searchTerm.toLowerCase();
    return fabricantes.filter(fabricante =>
      fabricante.nombre?.toLowerCase().includes(term) ||
      fabricante.pais?.toLowerCase().includes(term)
    );
  }, [fabricantes, searchTerm]);

  // Manejar creación
  const handleCreateFabricante = async (data: any) => {
    try {
      await createFabricante({
        nombre: data.nombre,
        pais: data.pais,
        soporte_tel: data.soporte_tel,
        web: data.web
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error al crear fabricante:', error);
    }
  };

  // Manejar edición
  const handleEditFabricante = async (data: any) => {
    if (!selectedFabricante) return;
    
    try {
      await updateFabricante(parseInt(selectedFabricante.id), {
        nombre: data.nombre,
        pais: data.pais,
        soporte_tel: data.soporte_tel,
        web: data.web
      });
      setIsEditModalOpen(false);
      setSelectedFabricante(null);
    } catch (error) {
      console.error('Error al editar fabricante:', error);
    }
  };

  const handleViewFabricante = (fabricante: any) => {
    setSelectedFabricante(fabricante);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (fabricante: any) => {
    setSelectedFabricante(fabricante);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fabricantes</h1>
          <p className="text-gray-600 mt-1">Gestión de fabricantes de equipos médicos</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Fabricante
        </Button>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder="Buscar fabricantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de fabricantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Mostrar skeletons mientras carga
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredFabricantes.map((fabricante, index) => (
            <motion.div
              key={fabricante.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => handleViewFabricante(fabricante)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {fabricante.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">{fabricante.pais}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Teléfono:</span>
                    <span className="font-medium">{fabricante.soporte_tel || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Website:</span>
                    <span className="font-medium truncate ml-2">{fabricante.web || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(fabricante);
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

      {!isLoading && filteredFabricantes.length === 0 && (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron fabricantes
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando un nuevo fabricante'}
          </p>
        </div>
      )}

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Fabricante"
      >
        <FabricanteForm
          onSubmit={handleCreateFabricante}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFabricante(null);
        }}
        title="Editar Fabricante"
      >
        <FabricanteForm
          fabricante={selectedFabricante}
          onSubmit={handleEditFabricante}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedFabricante(null);
          }}
        />
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFabricante(null);
        }}
        title="Detalles del Fabricante"
      >
        {selectedFabricante && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <p className="text-gray-900">{selectedFabricante.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <p className="text-gray-900">{selectedFabricante.pais}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <p className="text-gray-900">{selectedFabricante.soporte_tel || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <p className="text-gray-900">{selectedFabricante.web || 'N/A'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
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