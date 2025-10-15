'use client';

import { useState, useEffect } from 'react';
import { equiposService } from '../services/equiposService';
import { clientesService } from '../services/clientesService';
import { ordenesService } from '../services/ordenesService';
import { EquipmentUI, ClientUI, OrderUI } from '@/types/equipment';
import { useStore } from '@/store/useStore';
import { showToast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/types/errors';
import { 
  mapEquipmentToUI, 
  mapEquipmentToAPI, 
  mapClientToUI, 
  mapClientToAPI,
  mapOrderToUI,
  mapOrderToAPI,
  mapEquipmentsToUI,
  mapClientsToUI,
  mapOrdersToUI
} from '@/lib/mappers';

// Hook para gestión de equipos
export const useEquipments = () => {
  const { equipments, setEquipments, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await equiposService.getAll();
      if (error) throw error;
  // Adaptar tipos flexibles de Supabase a los tipos estrictos del frontend
  const mappedEquipments = Array.isArray(data) ? data.map((eq: any) => mapEquipmentToUI(eq)) : [];
  setEquipments(mappedEquipments);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar equipos';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createEquipment = async (data: Omit<EquipmentUI, 'id'>) => {
    try {
      setLoading(true);
      if (!data.cliente_id || !data.modalidad_id || !data.fabricante_id) {
        throw new Error('Faltan IDs de cliente, modalidad o fabricante');
      }
      const apiData = mapEquipmentToAPI(data);
      const { data: created, error } = await equiposService.create(apiData as any);
      if (error || !created) {
        const errorMessage = getErrorMessage(error) || error?.message || 'Error al crear equipo';
        showToast.error(errorMessage);
        throw new Error(errorMessage);
      }
      const tolerantEquipment = {
        ...created,
        estado_equipo: created?.estado_equipo || 'Operativo',
      } as any;
      const mappedEquipment = mapEquipmentToUI(tolerantEquipment);
      setEquipments([...equipments, mappedEquipment]);
      showToast.success('Equipo creado exitosamente');
      return mappedEquipment;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err) || err?.message || 'Error al crear equipo';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEquipment = async (id: string, data: Partial<EquipmentUI>) => {
    try {
      setLoading(true);
      if (!data.cliente_id || !data.modalidad_id || !data.fabricante_id) {
        throw new Error('Faltan IDs de cliente, modalidad o fabricante');
      }
      const apiData = mapEquipmentToAPI(data);
      const { data: updated, error } = await equiposService.update(parseInt(id), apiData as any);
      if (error || !updated) {
        const errorMessage = getErrorMessage(error) || error?.message || 'Error al actualizar equipo';
        showToast.error(errorMessage);
        throw new Error(errorMessage);
      }
      const tolerantEquipment = {
        ...updated,
        estado_equipo: updated?.estado_equipo || 'Operativo',
      } as any;
      const mappedEquipment = mapEquipmentToUI(tolerantEquipment);
      setEquipments(equipments.map(eq => eq.id === id ? mappedEquipment : eq));
      showToast.success('Equipo actualizado exitosamente');
      return mappedEquipment;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err) || err?.message || 'Error al actualizar equipo';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await equiposService.delete(parseInt(id));
      if (error) {
        const errorMessage = getErrorMessage(error) || error?.message || 'Error al eliminar equipo';
        showToast.error(errorMessage);
        throw new Error(errorMessage);
      }
      setEquipments(equipments.filter(eq => eq.id !== id));
      showToast.success('Equipo eliminado exitosamente');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err) || err?.message || 'Error al eliminar equipo';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (equipments.length === 0) {
      fetchEquipments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    equipments,
    error,
    fetchEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
  };
};

// Hook para gestión de clientes
export const useClients = () => {
  const { clients, setClients, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await clientesService.getAll();
      if (error) throw error;
  const mappedClients = Array.isArray(data) ? data.map((cl: any) => mapClientToUI(cl)) : [];
  setClients(mappedClients);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar clientes';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (data: Omit<ClientUI, 'id'>) => {
    try {
      setLoading(true);
      // mapClientToAPI puede devolver propiedades undefined, forzar string vacía si es necesario
      const apiData = {
        ...mapClientToAPI(data),
        nombre: data.nombre || '',
        tipo: data.tipo || 'publico',
      };
      const { data: created, error } = await clientesService.create(apiData as any);
      if (error || !created) throw error;
      // Adaptar el tipo Cliente (Supabase) a Client (frontend) para el mapper
      const tolerantClient = {
        ...created,
        tipo: created?.tipo || 'Hospital',
      } as any;
      const mappedClient = mapClientToUI(tolerantClient);
      setClients([...clients, mappedClient]);
      showToast.success('Cliente creado exitosamente');
      return mappedClient;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al crear cliente';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, data: Partial<ClientUI>) => {
    try {
      setLoading(true);
      const apiData = {
        ...mapClientToAPI(data),
        nombre: data.nombre || '',
        tipo: data.tipo || 'publico',
      };
      const { data: updated, error } = await clientesService.update(parseInt(id), apiData as any);
      if (error || !updated) throw error;
      const tolerantClient = {
        ...updated,
        tipo: updated?.tipo || 'Hospital',
      } as any;
      const mappedClient = mapClientToUI(tolerantClient);
      setClients(clients.map(cl => cl.id === id ? mappedClient : cl));
      showToast.success('Cliente actualizado exitosamente');
      return mappedClient;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al actualizar cliente';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      setLoading(true);
      await clientesService.delete(parseInt(id));
      setClients(clients.filter(cl => cl.id !== id));
      showToast.success('Cliente eliminado exitosamente');
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al eliminar cliente';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clients.length === 0) {
      fetchClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    clients,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
};

// Hook para gestión de órdenes
export const useOrders = () => {
  const { orders, setOrders, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await ordenesService.getAll();
      if (error) throw error;
  const mappedOrders = Array.isArray(data) ? data.map((or: any) => mapOrderToUI(or)) : [];
  setOrders(mappedOrders);
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al cargar órdenes';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (data: Omit<OrderUI, 'id'> & { equipo_id: number; cliente_id: number }) => {
    try {
      setLoading(true);
      // Usar los IDs reales del formulario
      const apiData = mapOrderToAPI(data);
      const { data: created, error } = await ordenesService.create(apiData as any);
      if (error || !created) throw error;
      const tolerantOrder = {
        ...created,
        prioridad: created?.prioridad || 'Media',
      } as any;
      const mappedOrder = mapOrderToUI(tolerantOrder);
      setOrders([...orders, mappedOrder]);
      showToast.success('Orden creada exitosamente');
      return mappedOrder;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al crear orden';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Busca el orden_id real a partir del id string del frontend
  const getOrdenIdByIdString = (id: string) => {
    const found = orders.find(or => or.id === id);
    // Si el id es numérico, úsalo directo
    if (!found && !isNaN(Number(id))) return Number(id);
    // Si se encuentra, intenta extraer el orden_id numérico
    if (found && found.id) return Number(found.id);
    return undefined;
  };

  const updateOrder = async (id: string, data: Partial<OrderUI> & { equipo_id?: number; cliente_id?: number }) => {
    try {
      setLoading(true);
      const ordenId = getOrdenIdByIdString(id);
      if (!ordenId) throw new Error('No se pudo determinar el orden_id real');
      const apiData = mapOrderToAPI(data, { isEdit: true });
      const { data: updated, error } = await ordenesService.update(ordenId, apiData as any);
      if (error || !updated) throw error;
      const tolerantOrder = {
        ...updated,
        prioridad: updated?.prioridad || 'Media',
      } as any;
      const mappedOrder = mapOrderToUI(tolerantOrder);
      setOrders(orders.map(or => or.id === id ? mappedOrder : or));
      showToast.success('Orden actualizada exitosamente');
      return mappedOrder;
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al actualizar orden';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      setLoading(true);
      const ordenId = getOrdenIdByIdString(id);
      if (!ordenId) throw new Error('No se pudo determinar el orden_id real');
      await ordenesService.delete(ordenId);
      setOrders(orders.filter(or => or.id !== id));
      showToast.success('Orden eliminada exitosamente');
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Error al eliminar orden';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    orders,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};

// Hook para operaciones con promesas y loading states
export const useAsyncOperation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T>(
    operation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await operation();
      if (successMessage) {
        showToast.success(successMessage);
      }
      return result;
    } catch (err) {
      const message = errorMessage || getErrorMessage(err) || 'Error en la operación';
      setError(message);
      showToast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    execute,
  };
};
