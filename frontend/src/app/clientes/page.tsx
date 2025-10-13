'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { slideUp, fade, staggerListParent, staggerListItem } from '@/lib/animationPresets';
import ScrollReveal from '@/components/animations/ScrollReveal';
import SplitText from '@/components/animations/SplitText';
import { useClients } from '@/hooks/useApi';
import { ClientUI } from '@/types/equipment';
import { Modal } from '@/components/ui/Modal';
import { ClientForm } from '@/components/forms/ClientForm';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  BeakerIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

// Usando la interfaz Client del API y datos del mock API

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientUI | null>(null);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  
  const { clients, createClient, updateClient, deleteClient } = useClients();

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = searchTerm === '' || 
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contacto.responsable.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo = selectedTipo === '' || client.tipo === selectedTipo;
      const matchesEstado = selectedEstado === '' || client.estado_cliente === selectedEstado;

      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [clients, searchTerm, selectedTipo, selectedEstado]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTipo('');
    setSelectedEstado('');
  };

  const hasActiveFilters = searchTerm || selectedTipo || selectedEstado;

  // Funciones para manejar el modal
  const openCreateModal = () => {
    setSelectedClient(null);
    setModalType('create');
    setModalOpen(true);
  };

  const handleViewClient = (client: ClientUI) => {
    setSelectedClient(client);
    setModalType('view');
    setModalOpen(true);
  };

  const handleEditClient = (client: ClientUI) => {
    setSelectedClient(client);
    setModalType('edit');
    setModalOpen(true);
  };

  const handleCreateClient = async (data: any) => {
    try {
      await createClient(data);
      setModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleUpdateClient = async (data: any) => {
    if (selectedClient) {
      try {
        await updateClient(selectedClient.id, data);
        setModalOpen(false);
        setSelectedClient(null);
      } catch (error) {
        console.error('Error updating client:', error);
      }
    }
  };

  const getTipoColor = (tipo: ClientUI['tipo']) => {
    return tipo === 'publico' 
      ? 'bg-blue-50 text-blue-600' 
      : 'bg-purple-50 text-purple-600';
  };

  const getEstadoColor = (estado: ClientUI['estado_cliente']) => {
    return estado === 'activo' 
      ? 'bg-green-50 text-green-600' 
      : 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        variants={fade}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <ScrollReveal enableBlur={true} baseOpacity={0.15} baseRotation={2} containerClassName="mb-2">
            <SplitText text="Clientes" tag="h1" className="text-4xl font-bold text-[#1D1D1F]" />
          </ScrollReveal>
          <p className="text-lg text-[#6E6E73]">
            Gestión de hospitales y clínicas
          </p>
        </div>

        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={openCreateModal}
        >
          <PlusIcon className="icon-sm" />
          <span>Nuevo Cliente</span>
        </button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.45, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1D1D1F]">Filtros</h3>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[#6E6E73] hover:text-[#FF3B30] transition-colors duration-200 text-sm font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="icon-md text-[#86868B]" />
            </div>
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los tipos</option>
            <option value="publico">Público</option>
            <option value="privado">Privado</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between text-sm text-[#6E6E73]"
      >
        <span>
          {filteredClients.length} clientes encontrados
        </span>
        {filteredClients.length !== clients.length && (
          <span>
            de {clients.length} total
          </span>
        )}
      </motion.div>

      {/* Clients List */}
      <motion.div
        variants={staggerListParent}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            variants={staggerListItem}
            className="card hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl icon-container">
                  <BuildingOfficeIcon className="icon-md text-blue-600" />
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#1D1D1F] truncate">
                      {client.nombre}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(client.tipo)}`}>
                      {client.tipo === 'publico' ? 'Público' : 'Privado'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(client.estado_cliente)}`}>
                      {client.estado_cliente === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {/* Location */}
                    <div className="flex items-center space-x-2 text-[#6E6E73]">
                      <MapPinIcon className="icon-sm" />
                      <span>{client.ciudad}, {client.estado}</span>
                    </div>

                    {/* Equipment Count */}
                    <div className="flex items-center space-x-2 text-[#6E6E73]">
                      <BeakerIcon className="icon-sm" />
                      <span>{client.equiposCount} equipos</span>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center space-x-2 text-[#6E6E73]">
                      <UserGroupIcon className="icon-sm" />
                      <span>{client.contacto.responsable}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                    {/* Phone */}
                    <div className="flex items-center space-x-2 text-[#86868B]">
                      <PhoneIcon className="icon-sm" />
                      <span>{client.contacto.telefono}</span>
                    </div>

                    {/* Last Activity */}
                    <div className="flex items-center space-x-2 text-[#86868B]">
                      <CalendarIcon className="icon-sm" />
                      <span>Últ. actividad: {client.ultimaActividad}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => handleViewClient(client)}
                  title="Ver detalles"
                >
                  <EyeIcon className="icon-sm text-[#6E6E73]" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="icon-lg text-[#86868B]" />
          </div>
          <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
            No se encontraron clientes
          </h3>
          <p className="text-[#6E6E73] mb-6">
            Intenta ajustar los filtros o términos de búsqueda
          </p>
          <button 
            onClick={clearFilters}
            className="btn-secondary"
          >
            Limpiar filtros
          </button>
        </motion.div>
      )}

      {/* Pagination */}
      {filteredClients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center pt-4"
        >
          <div className="flex items-center space-x-2 text-[#6E6E73]">
            <button className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              ←
            </button>
            <span className="px-3 py-2 bg-[#0071E3] text-white rounded-lg">1</span>
            <span className="px-3 py-2">2</span>
            <button className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              →
            </button>
          </div>
        </motion.div>
      )}

      {/* Modal para crear/editar/ver cliente */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedClient(null);
        }}
        title={
          modalType === 'create' ? 'Nuevo Cliente' :
          modalType === 'edit' ? 'Editar Cliente' : 'Detalles del Cliente'
        }
        size="lg"
      >
        {modalType === 'view' && selectedClient ? (
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Información General</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nombre:</span>
                    <p className="text-gray-900">{selectedClient.nombre}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Tipo:</span>
                    <p className="text-gray-900">{selectedClient.tipo === 'publico' ? 'Público' : 'Privado'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Ciudad:</span>
                    <p className="text-gray-900">{selectedClient.ciudad}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Estado:</span>
                    <p className="text-gray-900">{selectedClient.estado}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Contacto</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Responsable:</span>
                    <p className="text-gray-900">{selectedClient.contacto.responsable}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                    <p className="text-gray-900">{selectedClient.contacto.telefono}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{selectedClient.contacto.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Equipos:</span>
                    <p className="text-gray-900">{selectedClient.equiposCount} equipos</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button 
                className="btn-ghost"
                onClick={() => handleEditClient(selectedClient)}
              >
                Editar
              </button>
              <button 
                className="btn-ghost"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedClient(null);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <ClientForm 
            client={modalType === 'edit' && selectedClient ? selectedClient : undefined}
            onSubmit={modalType === 'edit' ? handleUpdateClient : handleCreateClient}
            onCancel={() => {
              setModalOpen(false);
              setSelectedClient(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
