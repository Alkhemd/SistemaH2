'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { useOrdenes } from '@/hooks/useCatalogs';
import { useEquipments, useClients } from '@/hooks/useApi';
import { useTecnicos } from '@/hooks/useCatalogs';
import { showToast } from '@/components/ui/Toast';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { useStore } from '@/store/useStore';

interface Order {
  id: string;
  equipo: {
    modelo: string;
    numeroSerie: string;
    fabricante: string;
  };
  cliente: string;
  prioridad: 'critica' | 'alta' | 'normal';
  estado: 'abierta' | 'proceso' | 'cerrada';
  tipo: 'correctivo' | 'preventivo' | 'calibracion';
  titulo: string;
  fechaCreacion: string;
  fechaVencimiento?: string;
  tecnico?: string;
  tiempoEstimado: string;
}

export default function OrdenesPage() {
  // Hooks para datos del API
  const { ordenes: orders, createOrden: createOrder, updateOrden: updateOrder, deleteOrden: deleteOrder, isLoading: isLoadingOrdenes } = useOrdenes();
  const { equipments } = useEquipments();
  const { clients } = useClients();
  const { tecnicos } = useTecnicos();
  const { isLoading: isLoadingOrders } = useStore();
  
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrioridad, setSelectedPrioridad] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    equipo_id: 0,
    cliente_id: 0,
    tipo: 'correctivo' as 'correctivo' | 'preventivo' | 'calibracion',
    prioridad: 'normal' as 'critica' | 'alta' | 'normal',
    titulo: '',
    descripcion: '',
    tecnico_id: undefined as number | undefined,
    fecha_vencimiento: '',
    tiempo_estimado: ''
  });

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name.includes('_id') ? (value ? parseInt(value) : 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.equipo_id || formData.equipo_id === 0) {
      showToast.error('Selecciona un equipo');
      return;
    }
    if (!formData.cliente_id || formData.cliente_id === 0) {
      showToast.error('Selecciona un cliente');
      return;
    }
    if (!formData.titulo.trim()) {
      showToast.error('Ingresa un título');
      return;
    }

    setIsLoading(true);
    try {
      await createOrder({
        equipo_id: formData.equipo_id,
        cliente_id: formData.cliente_id,
        prioridad: formData.prioridad.charAt(0).toUpperCase() + formData.prioridad.slice(1),
        estado: formData.tipo === 'preventivo' ? 'En Proceso' : 'Abierta',
        falla_reportada: formData.descripcion || formData.titulo,
        origen: 'Portal'
      });
      showToast.success('¡Orden creada exitosamente!');
      setIsModalOpen(false);
      // Resetear formulario
      setFormData({
        equipo_id: 0,
        cliente_id: 0,
        tipo: 'correctivo',
        prioridad: 'normal',
        titulo: '',
        descripcion: '',
        tecnico_id: undefined,
        fecha_vencimiento: '',
        tiempo_estimado: ''
      });
    } catch (error: any) {
      console.error('Error al crear orden:', error);
      showToast.error(error.response?.data?.message || 'Error al crear la orden');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
    setOpenMenuId(null);
  };

  // Estado para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

  const handleEdit = (order: Order) => {
    const orderData = order as any;
    setEditFormData({
      id: order.id,
      equipo_id: orderData.equipo_id || 0,
      cliente_id: orderData.cliente_id || 0,
      prioridad: order.prioridad,
      estado: order.estado,
      titulo: order.titulo,
      descripcion: orderData.descripcion || order.titulo || '',
    });
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;
    setIsLoading(true);
    try {
      await updateOrder(parseInt(editFormData.id), {
        equipo_id: editFormData.equipo_id,
        cliente_id: editFormData.cliente_id,
        prioridad: editFormData.prioridad,
        estado: editFormData.estado,
        falla_reportada: editFormData.descripcion || editFormData.titulo
      });
      showToast.success('¡Orden actualizada exitosamente!');
      setIsEditModalOpen(false);
    } catch (error: any) {
      showToast.error('Error al actualizar la orden');
    } finally {
      setIsLoading(false);
    }
  };

  // Estado para cambio de estado
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('abierta');

  const handleChangeStatus = (order: Order) => {
    setStatusOrder(order);
    setNewStatus(order.estado);
    setIsStatusModalOpen(true);
    setOpenMenuId(null);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusOrder) return;
    setIsLoading(true);
    try {
      await updateOrder(parseInt(statusOrder.id), { estado: newStatus });
      showToast.success('Estado actualizado');
      setIsStatusModalOpen(false);
    } catch (error) {
      showToast.error('Error al cambiar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!confirm(`¿Estás seguro de eliminar la orden ${order.id}?`)) {
      return;
    }
    
    try {
      await deleteOrder(parseInt(order.id));
      showToast.success('Orden eliminada exitosamente');
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      showToast.error('Error al eliminar la orden');
    }
  };

  const toggleMenu = (orderId: string) => {
    setOpenMenuId(openMenuId === orderId ? null : orderId);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order: Order) => {
      const matchesSearch = searchTerm === '' || 
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.equipo?.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.titulo?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrioridad = selectedPrioridad === '' || order.prioridad === selectedPrioridad;
      const matchesEstado = selectedEstado === '' || order.estado === selectedEstado;
      const matchesTipo = selectedTipo === '' || order.tipo === selectedTipo;

      return matchesSearch && matchesPrioridad && matchesEstado && matchesTipo;
    });
  }, [orders, searchTerm, selectedPrioridad, selectedEstado, selectedTipo]);

  const getPriorityIcon = (prioridad: Order['prioridad']) => {
    switch (prioridad) {
      case 'critica':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'alta':
        return <AlertTriangle size={16} className="text-orange-500" />;
      case 'normal':
        return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  const getPriorityColor = (prioridad: Order['prioridad']) => {
    switch (prioridad) {
      case 'critica':
        return 'bg-red-50 text-red-600';
      case 'alta':
        return 'bg-orange-50 text-orange-600';
      case 'normal':
        return 'bg-green-50 text-green-600';
    }
  };

  const getStatusColor = (estado: Order['estado']) => {
    switch (estado) {
      case 'abierta':
        return 'bg-red-50 text-red-600';
      case 'proceso':
        return 'bg-yellow-50 text-yellow-600';
      case 'cerrada':
        return 'bg-green-50 text-green-600';
    }
  };

  const getStatusIcon = (estado: Order['estado']) => {
    switch (estado) {
      case 'abierta':
        return <Clock size={16} className="text-red-500" />;
      case 'proceso':
        return <Settings size={16} className="text-yellow-500" />;
      case 'cerrada':
        return <CheckCircle size={16} className="text-green-500" />;
    }
  };

  const clearFilters = () => {
    setSelectedPrioridad('');
    setSelectedEstado('');
    setSelectedTipo('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedPrioridad || selectedEstado || selectedTipo || searchTerm;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm-flex-row sm-items-center sm-justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#1D1D1F] mb-2">
            Órdenes de Trabajo
          </h1>
          <p className="text-lg text-[#6E6E73]">
            Gestión de órdenes de mantenimiento y reparación
          </p>
        </div>

        <motion.button 
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Nueva Orden</span>
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-[#6E6E73]" />
            <h3 className="font-semibold text-[#1D1D1F]">Filtros</h3>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[#6E6E73] hover:text-[#FF3B30] transition-colors duration-200 text-sm font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#86868B]" />
            </div>
            <input
              type="text"
              placeholder="Buscar órdenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={selectedPrioridad}
            onChange={(e) => setSelectedPrioridad(e.target.value)}
            className="input-field"
          >
            <option value="">Todas las prioridades</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="normal">Normal</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los estados</option>
            <option value="abierta">Abierta</option>
            <option value="proceso">En Proceso</option>
            <option value="cerrada">Cerrada</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los tipos</option>
            <option value="correctivo">Correctivo</option>
            <option value="preventivo">Preventivo</option>
            <option value="calibracion">Calibración</option>
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
          {filteredOrders.length} órdenes encontradas
        </span>
        {filteredOrders.length !== orders.length && (
          <span>
            de {orders.length} total
          </span>
        )}
      </motion.div>

      {/* Orders Table */}
      {isLoadingOrders ? (
        <SkeletonTable rows={8} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm">Equipo</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm">Cliente</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm">Prioridad</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm">Estado</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm">Fecha</th>
                  <th className="text-left py-4 px-4 font-semibold text-[#6E6E73] text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-[#0071E3] font-medium">
                      {order.id}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-[#1D1D1F] text-sm">
                        {order.equipo.modelo}
                      </p>
                      <p className="text-xs text-[#86868B]">
                        {order.equipo.fabricante}
                      </p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#6E6E73]">{order.cliente}</span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.prioridad)}`}>
                      {getPriorityIcon(order.prioridad)}
                      <span className="capitalize">{order.prioridad}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                      {getStatusIcon(order.estado)}
                      <span className="capitalize">{order.estado}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-sm text-[#6E6E73]">
                      <Calendar size={14} />
                      <span>{order.fechaCreacion}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4 relative">
                    <div className="flex items-center space-x-2">
                      {/* Botón de menú desplegable */}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(order.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <MoreVertical size={16} className="text-[#6E6E73]" />
                        </button>
                        
                        {/* Menú desplegable */}
                        <AnimatePresence>
                          {openMenuId === order.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleViewDetails(order)}
                                className="w-full px-4 py-2 text-left text-sm text-[#1D1D1F] hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                              >
                                <Eye size={16} className="text-[#0071E3]" />
                                <span>Ver detalles</span>
                              </button>
                              
                              <button
                                onClick={() => handleEdit(order)}
                                className="w-full px-4 py-2 text-left text-sm text-[#1D1D1F] hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                              >
                                <Edit size={16} className="text-[#34C759]" />
                                <span>Editar</span>
                              </button>
                              
                              <button
                                onClick={() => handleChangeStatus(order)}
                                className="w-full px-4 py-2 text-left text-sm text-[#1D1D1F] hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                              >
                                <RefreshCw size={16} className="text-[#FF9500]" />
                                <span>Cambiar estado</span>
                              </button>
                              
                              <div className="border-t border-gray-200 my-1"></div>
                              
                              <button
                                onClick={() => handleDelete(order)}
                                className="w-full px-4 py-2 text-left text-sm text-[#FF3B30] hover:bg-red-50 flex items-center space-x-2 transition-colors"
                              >
                                <Trash2 size={16} />
                                <span>Eliminar</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-[#6E6E73]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
              No se encontraron órdenes
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
          </div>
        )}
        </motion.div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
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
            <span className="px-3 py-2">3</span>
            <button className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              →
            </button>
          </div>
        </motion.div>
      )}

      {/* Modal Nueva Orden */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1D1D1F]">Nueva Orden de Trabajo</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Información del Equipo */}
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4">Información del Equipo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                      Equipo *
                    </label>
                    <select 
                      name="equipo_id"
                      value={formData.equipo_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="0">Seleccionar equipo...</option>
                      {equipments.map((equipo: any) => (
                        <option key={equipo.id} value={equipo.id}>
                          {equipo.modelo} - {equipo.numeroSerie}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                      Cliente *
                    </label>
                    <select 
                      name="cliente_id"
                      value={formData.cliente_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="0">Seleccionar cliente...</option>
                      {clients.map((cliente: any) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Detalles de la Orden */}
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4">Detalles de la Orden</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ej: Mantenimiento preventivo trimestral"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe el problema o trabajo a realizar..."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Tipo *
                      </label>
                      <select 
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="correctivo">Correctivo</option>
                        <option value="preventivo">Preventivo</option>
                        <option value="calibracion">Calibración</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Prioridad *
                      </label>
                      <select 
                        name="prioridad"
                        value={formData.prioridad}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="critica">Crítica</option>
                        <option value="alta">Alta</option>
                        <option value="normal">Normal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Técnico
                      </label>
                      <select 
                        name="tecnico_id"
                        value={formData.tecnico_id || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Sin asignar</option>
                        {tecnicos.map(tecnico => (
                          <option key={tecnico.id} value={tecnico.id}>
                            {tecnico.nombre} {tecnico.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Fecha de Vencimiento
                      </label>
                      <input
                        type="date"
                        name="fecha_vencimiento"
                        value={formData.fecha_vencimiento}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#6E6E73] mb-2">
                        Tiempo Estimado
                      </label>
                      <input
                        type="text"
                        name="tiempo_estimado"
                        value={formData.tiempo_estimado}
                        onChange={handleInputChange}
                        placeholder="Ej: 2 horas"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer del Modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-[#6E6E73] hover:text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creando...</span>
                  </>
                ) : (
                  <span>Crear Orden</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de Detalles */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsDetailsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Modal */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1D1D1F]">Detalles de la Orden</h2>
                    <p className="text-sm text-[#6E6E73] mt-1">
                      Orden {selectedOrder.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6">
                {/* Estado y Prioridad */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-[#6E6E73] mb-2">Estado</p>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.estado)}`}>
                      {getStatusIcon(selectedOrder.estado)}
                      <span className="capitalize">{selectedOrder.estado}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-[#6E6E73] mb-2">Prioridad</p>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getPriorityColor(selectedOrder.prioridad)}`}>
                      {getPriorityIcon(selectedOrder.prioridad)}
                      <span className="capitalize">{selectedOrder.prioridad}</span>
                    </div>
                  </div>
                </div>

                {/* Información General */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center space-x-2">
                    <FileText size={20} className="text-[#0071E3]" />
                    <span>Información General</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Título</p>
                      <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.titulo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Tipo de Orden</p>
                      <p className="text-sm font-medium text-[#1D1D1F] capitalize">{selectedOrder.tipo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6E6E73] mb-1">Fecha de Creación</p>
                        <div className="flex items-center space-x-1 text-sm font-medium text-[#1D1D1F]">
                          <Calendar size={14} />
                          <span>{selectedOrder.fechaCreacion}</span>
                        </div>
                      </div>
                      {selectedOrder.fechaVencimiento && (
                        <div>
                          <p className="text-xs text-[#6E6E73] mb-1">Fecha de Vencimiento</p>
                          <div className="flex items-center space-x-1 text-sm font-medium text-[#1D1D1F]">
                            <Calendar size={14} />
                            <span>{selectedOrder.fechaVencimiento}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Tiempo Estimado</p>
                      <div className="flex items-center space-x-1 text-sm font-medium text-[#1D1D1F]">
                        <Clock size={14} />
                        <span>{selectedOrder.tiempoEstimado}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Equipo */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center space-x-2">
                    <Settings size={20} className="text-[#34C759]" />
                    <span>Equipo</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Modelo</p>
                      <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.equipo.modelo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6E6E73] mb-1">Fabricante</p>
                        <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.equipo.fabricante}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6E6E73] mb-1">Número de Serie</p>
                        <p className="text-sm font-mono text-[#1D1D1F]">{selectedOrder.equipo.numeroSerie}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Cliente */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center space-x-2">
                    <User size={20} className="text-[#AF52DE]" />
                    <span>Cliente</span>
                  </h3>
                  <div>
                    <p className="text-xs text-[#6E6E73] mb-1">Nombre</p>
                    <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.cliente}</p>
                  </div>
                </div>

                {/* Técnico Asignado */}
                {selectedOrder.tecnico && (
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center space-x-2">
                      <User size={20} className="text-[#FF9500]" />
                      <span>Técnico Asignado</span>
                    </h3>
                    <div>
                      <p className="text-xs text-[#6E6E73] mb-1">Nombre</p>
                      <p className="text-sm font-medium text-[#1D1D1F]">{selectedOrder.tecnico}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer del Modal */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEdit(selectedOrder)}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Edición */}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">Editar Orden</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">Prioridad</label>
                <select
                  value={editFormData.prioridad}
                  onChange={(e) => setEditFormData({...editFormData, prioridad: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="critica">Crítica</option>
                  <option value="alta">Alta</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">Estado</label>
                <select
                  value={editFormData.estado}
                  onChange={(e) => setEditFormData({...editFormData, estado: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="abierta">Abierta</option>
                  <option value="proceso">En Proceso</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">Descripción</label>
                <textarea
                  value={editFormData.descripcion}
                  onChange={(e) => setEditFormData({...editFormData, descripcion: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 text-[#6E6E73] hover:text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cambio de Estado */}
      {isStatusModalOpen && statusOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">Cambiar Estado</h2>
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6E6E73] mb-2">Estado</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="abierta">Abierta</option>
                  <option value="proceso">En Proceso</option>
                  <option value="cerrada">Cerrada</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-6 py-2.5 text-[#6E6E73] hover:text-[#1D1D1F] font-medium rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Estado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
