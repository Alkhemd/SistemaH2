'use client';

import { useState, useEffect } from 'react';
import { mockEquipmentApi, mockClientApi, mockOrderApi } from '@/lib/mockApi';
import { EquipmentUI, ClientUI, OrderUI } from '@/types/equipment';
import { useStore } from '@/store/useStore';
import { showToast } from '@/components/ui/Toast';

// Hook temporal para gestión de equipos usando mock API
export const useEquipments = () => {
  const { equipments, setEquipments, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockEquipmentApi.getAll();
      setEquipments(response.data);
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
      const response = await mockEquipmentApi.create(data);
      setEquipments([...equipments, response.data]);
      showToast.success('Equipo creado exitosamente');
      return response.data;
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
      const response = await mockEquipmentApi.update(id, data);
      setEquipments(equipments.map(eq => eq.id === id ? response.data : eq));
      showToast.success('Equipo actualizado exitosamente');
      return response.data;
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
      await mockEquipmentApi.delete(id);
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

// Hook temporal para gestión de clientes usando mock API
export const useClients = () => {
  const { clients, setClients, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockClientApi.getAll();
      setClients(response.data);
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
      const response = await mockClientApi.create(data);
      setClients([...clients, response.data]);
      showToast.success('Cliente creado exitosamente');
      return response.data;
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
      const response = await mockClientApi.update(id, data);
      setClients(clients.map(cl => cl.id === id ? response.data : cl));
      showToast.success('Cliente actualizado exitosamente');
      return response.data;
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
      await mockClientApi.delete(id);
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

// Hook temporal para gestión de órdenes usando mock API
export const useOrders = () => {
  const { orders, setOrders, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mockOrderApi.getAll();
      setOrders(response.data);
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
      const response = await mockOrderApi.create(data);
      setOrders([...orders, response.data]);
      showToast.success('Orden creada exitosamente');
      return response.data;
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
      const response = await mockOrderApi.update(id, data);
      setOrders(orders.map(or => or.id === id ? response.data : or));
      showToast.success('Orden actualizada exitosamente');
      return response.data;
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
      await mockOrderApi.delete(id);
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