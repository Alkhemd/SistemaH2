'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TecnicoForm } from '@/components/forms/TecnicoForm';

// Mock data para técnicos
const mockTecnicos = [
  {
    id: '1',
    nombre: 'Juan Carlos Mendoza',
    especialidad: 'CT',
    certificaciones: 'DICOM, PACS',
    telefono: '+52-55-1234-5678',
    email: 'juan.mendoza@hospital.com',
    base_ciudad: 'Ciudad de México',
    activo: true,
    ordenes_asignadas: 5
  },
  {
    id: '2',
    nombre: 'María Elena Rodriguez',
    especialidad: 'MR',
    certificaciones: 'Resonancia Magnética Nivel 2',
    telefono: '+52-33-8765-4321',
    email: 'maria.rodriguez@hospital.com',
    base_ciudad: 'Guadalajara',
    activo: true,
    ordenes_asignadas: 3
  },
  {
    id: '3',
    nombre: 'Roberto Silva',
    especialidad: 'Multi-mod',
    certificaciones: 'XR, US, CT',
    telefono: '+52-81-5555-0123',
    email: 'roberto.silva@hospital.com',
    base_ciudad: 'Monterrey', 
    activo: false,
    ordenes_asignadas: 0
  }
];

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
  const [tecnicos, setTecnicos] = useState(mockTecnicos);
  const [filteredTecnicos, setFilteredTecnicos] = useState(mockTecnicos);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Manejar búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = tecnicos.filter(tecnico =>
      tecnico.nombre.toLowerCase().includes(term.toLowerCase()) ||
      tecnico.especialidad?.toLowerCase().includes(term.toLowerCase()) ||
      tecnico.base_ciudad?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTecnicos(filtered);
  };

  // Manejar creación
  const handleCreateTecnico = async (data: any) => {
    const newTecnico = {
      id: Date.now().toString(),
      ...data,
      ordenes_asignadas: 0
    };
    setTecnicos([...tecnicos, newTecnico]);
    setFilteredTecnicos([...filteredTecnicos, newTecnico]);
    setIsCreateModalOpen(false);
  };

  // Manejar edición
  const handleEditTecnico = async (data: any) => {
    const updatedTecnicos = tecnicos.map(t =>
      t.id === selectedTecnico?.id ? { ...t, ...data } : t
    );
    setTecnicos(updatedTecnicos);
    setFilteredTecnicos(updatedTecnicos);
    setIsEditModalOpen(false);
    setSelectedTecnico(null);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Técnicos</h1>
          <p className="text-gray-600 mt-1">Gestión de técnicos especializados</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Técnico
        </Button>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar técnicos..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Lista de técnicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <span>Órdenes asignadas:</span>
                    <span className="font-semibold">{tecnico.ordenes_asignadas}</span>
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
      </div>

      {filteredTecnicos.length === 0 && (
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