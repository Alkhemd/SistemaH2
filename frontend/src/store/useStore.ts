import { create } from 'zustand';
import { EquipmentUI, ClientUI, OrderUI } from '@/types/equipment';

interface AppState {
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Equipment state
  equipments: EquipmentUI[];
  selectedEquipment: EquipmentUI | null;
  setEquipments: (equipments: EquipmentUI[]) => void;
  setSelectedEquipment: (equipment: EquipmentUI | null) => void;
  addEquipment: (equipment: EquipmentUI) => void;
  updateEquipment: (id: string, equipment: Partial<EquipmentUI>) => void;
  removeEquipment: (id: string) => void;
  
  // Client state
  clients: ClientUI[];
  selectedClient: ClientUI | null;
  setClients: (clients: ClientUI[]) => void;
  setSelectedClient: (client: ClientUI | null) => void;
  addClient: (client: ClientUI) => void;
  updateClient: (id: string, client: Partial<ClientUI>) => void;
  removeClient: (id: string) => void;
  
  // Order state
  orders: OrderUI[];
  selectedOrder: OrderUI | null;
  setOrders: (orders: OrderUI[]) => void;
  setSelectedOrder: (order: OrderUI | null) => void;
  addOrder: (order: OrderUI) => void;
  updateOrder: (id: string, order: Partial<OrderUI>) => void;
  removeOrder: (id: string) => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Modal state
  modalOpen: boolean;
  modalType: 'create' | 'edit' | 'delete' | null;
  modalEntity: 'equipment' | 'client' | 'order' | null;
  setModal: (open: boolean, type?: 'create' | 'edit' | 'delete', entity?: 'equipment' | 'client' | 'order') => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Loading states
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Equipment state
  equipments: [],
  selectedEquipment: null,
  setEquipments: (equipments) => set({ equipments }),
  setSelectedEquipment: (equipment) => set({ selectedEquipment: equipment }),
  addEquipment: (equipment) => set((state) => ({ 
    equipments: [...state.equipments, equipment] 
  })),
  updateEquipment: (id, updatedEquipment) => set((state) => ({
    equipments: state.equipments.map(eq => 
      eq.id === id ? { ...eq, ...updatedEquipment } : eq
    )
  })),
  removeEquipment: (id) => set((state) => ({
    equipments: state.equipments.filter(eq => eq.id !== id)
  })),
  
  // Client state
  clients: [],
  selectedClient: null,
  setClients: (clients) => set({ clients }),
  setSelectedClient: (client) => set({ selectedClient: client }),
  addClient: (client) => set((state) => ({ 
    clients: [...state.clients, client] 
  })),
  updateClient: (id, updatedClient) => set((state) => ({
    clients: state.clients.map(cl => 
      cl.id === id ? { ...cl, ...updatedClient } : cl
    )
  })),
  removeClient: (id) => set((state) => ({
    clients: state.clients.filter(cl => cl.id !== id)
  })),
  
  // Order state
  orders: [],
  selectedOrder: null,
  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  addOrder: (order) => set((state) => ({ 
    orders: [...state.orders, order] 
  })),
  updateOrder: (id, updatedOrder) => set((state) => ({
    orders: state.orders.map(or => 
      or.id === id ? { ...or, ...updatedOrder } : or
    )
  })),
  removeOrder: (id) => set((state) => ({
    orders: state.orders.filter(or => or.id !== id)
  })),
  
  // UI state
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Modal state
  modalOpen: false,
  modalType: null,
  modalEntity: null,
  setModal: (open, type, entity) => set({ 
    modalOpen: open, 
    modalType: type || null, 
    modalEntity: entity || null 
  }),
}));
