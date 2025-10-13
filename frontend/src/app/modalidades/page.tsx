'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { ModalidadForm } from '@/components/forms/ModalidadForm';
import { Modalidad, modalidadApi } from '@/lib/api';
import { showToast } from '@/components/ui/Toast';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline';

export default function ModalidadesPage() {
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [filteredModalidades, setFilteredModalidades] = useState<Modalidad[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalidad, setSelectedModalidad] = useState<Modalidad | null>(null);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchModalidades();
  }, []);

  useEffect(() => {
    const filtered = modalidades.filter(modalidad => 
      modalidad.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (modalidad.descripcion && modalidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredModalidades(filtered);
  }, [modalidades, searchTerm]);

  const fetchModalidades = async () => {
    try {
      setIsLoading(true);
      const response = await modalidadApi.getAll();
      const data = response.data.data || response.data;
      setModalidades(data);
    } catch (error) {
      showToast.error('Error al cargar modalidades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (type: 'create' | 'edit', modalidad?: Modalidad) => {
    setModalType(type);
    setSelectedModalidad(modalidad || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedModalidad(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (modalType === 'create') {
        const response = await modalidadApi.create(data);
        const newModalidad = response.data.data || response.data;
        setModalidades([...modalidades, newModalidad]);
        showToast.success('Modalidad creada exitosamente');
      } else if (selectedModalidad) {
        const response = await modalidadApi.update(selectedModalidad.modalidad_id, data);
        const updatedModalidad = response.data.data || response.data;
        setModalidades(modalidades.map(m => 
          m.modalidad_id === selectedModalidad.modalidad_id ? updatedModalidad : m
        ));
        showToast.success('Modalidad actualizada exitosamente');
      }
      handleCloseModal();
    } catch (error) {
      showToast.error('Error al guardar modalidad');
    }
  };

  const handleDelete = async (modalidad: Modalidad) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la modalidad "${modalidad.codigo}"?`)) {
      try {
        await modalidadApi.delete(modalidad.modalidad_id);
        setModalidades(modalidades.filter(m => m.modalidad_id !== modalidad.modalidad_id));
        showToast.success('Modalidad eliminada exitosamente');
      } catch (error) {
        showToast.error('Error al eliminar modalidad');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modalidades</h1>
          <p className="text-gray-600 mt-2">
            Gestión de modalidades de equipos médicos
          </p>
        </div>
        <button
          onClick={() => handleOpenModal('create')}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Modalidad
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Lista de Modalidades */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando modalidades...</p>
          </div>
        ) : filteredModalidades.length === 0 ? (
          <div className="p-8 text-center">
            <TagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No se encontraron modalidades que coincidan con la búsqueda' : 'No hay modalidades registradas'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenModal('create')}
                className="btn-primary mt-4"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Crear Primera Modalidad
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredModalidades.map((modalidad, index) => (
                  <motion.tr
                    key={modalidad.modalidad_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <TagIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {modalidad.codigo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {modalidad.descripcion || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal('edit', modalidad)}
                        className="text-blue-600 hover:text-blue-900 mr-3 p-1 rounded-md hover:bg-blue-50 transition-colors"
                        title="Editar modalidad"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(modalidad)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Eliminar modalidad"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalType === 'create' ? 'Nueva Modalidad' : 'Editar Modalidad'}
        size="md"
      >
        <ModalidadForm
          modalidad={selectedModalidad || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}