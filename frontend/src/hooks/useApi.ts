'use client';

import { useState, useEffect } from 'react';
import { equipmentApi, clientApi, orderApi } from '@/lib/api';
import { EquipmentUI, ClientUI, OrderUI } from '@/types/equipment';
import { useStore } from '@/store/useStore';
import { showToast } from '@/components/ui/Toast';
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
      const response = await equipmentApi.getAll();
      const mappedEquipments = mapEquipmentsToUI(response.data.data);
      setEquipments(mappedEquipments);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar equipos';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createEquipment = async (data: Omit<EquipmentUI, 'id'>) => {
    try {
      setLoading(true);
      // TODO: Obtener IDs reales de cliente, modalidad y fabricante
      const apiData = mapEquipmentToAPI(data, 1, 1, 1);
      const response = await equipmentApi.create(apiData as any);
      const mappedEquipment = mapEquipmentToUI(response.data.data);
      setEquipments([...equipments, mappedEquipment]);
      showToast.success('Equipo creado exitosamente');
      return mappedEquipment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear equipo';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEquipment = async (id: string, data: Partial<EquipmentUI>) => {
    try {
      setLoading(true);
      const apiData = mapEquipmentToAPI(data);
      const response = await equipmentApi.update(parseInt(id), apiData);
      const mappedEquipment = mapEquipmentToUI(response.data.data);
      setEquipments(equipments.map(eq => eq.id === id ? mappedEquipment : eq));
      showToast.success('Equipo actualizado exitosamente');
      return mappedEquipment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar equipo';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      setLoading(true);
      await equipmentApi.delete(parseInt(id));
      setEquipments(equipments.filter(eq => eq.id !== id));
      showToast.success('Equipo eliminado exitosamente');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar equipo';
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
      const response = await clientApi.getAll();
      const mappedClients = mapClientsToUI(response.data.data);
      setClients(mappedClients);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar clientes';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (data: Omit<ClientUI, 'id'>) => {
    try {
      setLoading(true);
      const apiData = mapClientToAPI(data);
      const response = await clientApi.create(apiData as any);
      const mappedClient = mapClientToUI(response.data.data);
      setClients([...clients, mappedClient]);
      showToast.success('Cliente creado exitosamente');
      return mappedClient;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear cliente';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, data: Partial<ClientUI>) => {
    try {
      setLoading(true);
      const apiData = mapClientToAPI(data);
      const response = await clientApi.update(parseInt(id), apiData);
      const mappedClient = mapClientToUI(response.data.data);
      setClients(clients.map(cl => cl.id === id ? mappedClient : cl));
      showToast.success('Cliente actualizado exitosamente');
      return mappedClient;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar cliente';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      setLoading(true);
      await clientApi.delete(parseInt(id));
      setClients(clients.filter(cl => cl.id !== id));
      showToast.success('Cliente eliminado exitosamente');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar cliente';
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
      const response = await orderApi.getAll();
      const mappedOrders = mapOrdersToUI(response.data.data);
      setOrders(mappedOrders);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar órdenes';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (data: Omit<OrderUI, 'id'>) => {
    try {
      setLoading(true);
      // TODO: Obtener IDs reales de equipo y cliente
      const apiData = mapOrderToAPI(data, 1, 1);
      const response = await orderApi.create(apiData as any);
      const mappedOrder = mapOrderToUI(response.data.data);
      setOrders([...orders, mappedOrder]);
      showToast.success('Orden creada exitosamente');
      return mappedOrder;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear orden';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: string, data: Partial<OrderUI>) => {
    try {
      setLoading(true);
      const apiData = mapOrderToAPI(data);
      const response = await orderApi.update(parseInt(id), apiData);
      const mappedOrder = mapOrderToUI(response.data.data);
      setOrders(orders.map(or => or.id === id ? mappedOrder : or));
      showToast.success('Orden actualizada exitosamente');
      return mappedOrder;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar orden';
      showToast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      setLoading(true);
      await orderApi.delete(parseInt(id));
      setOrders(orders.filter(or => or.id !== id));
      showToast.success('Orden eliminada exitosamente');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar orden';
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
    } catch (err: any) {
      const message = errorMessage || err.response?.data?.message || 'Error en la operación';
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
