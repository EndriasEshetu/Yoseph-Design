import { create } from 'zustand';
import { Product } from '../data/products';
import { Order, OrderStatus, ContactMessage, ContactMessageStatus } from '../types/admin';
import { useAdminAuthStore } from './adminAuthStore';
import { API_URL } from '../config';

export type ModelFormat = 'RVT' | 'FBX' | 'OBJ' | 'SKP' | '3DS' | 'DWG';

export interface StudioModel {
  id: string;
  name: string;
  description: string;
  price?: number;
  format?: ModelFormat;
  category: string;
  image: string;
  featured?: boolean;
  pdfUrl?: string;
}

export interface DashboardStats {
  currentMonth: { revenue: number; orderCount: number };
  previousMonth: { revenue: number; orderCount: number };
  totalProducts: number;
  newsletterCount: number;
  ordersByStatus: Record<string, number>;
  revenueByCategory: Record<string, number>;
  topCategory: string;
}

interface AdminState {
  products: Product[];
  orders: Order[];
  studioModels: StudioModel[];
  contactMessages: ContactMessage[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchStudioModels: () => Promise<void>;
  fetchContactMessages: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addStudioModel: (model: Omit<StudioModel, 'id'>) => Promise<void>;
  updateStudioModel: (model: StudioModel) => Promise<void>;
  deleteStudioModel: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateContactMessageStatus: (id: string, status: ContactMessageStatus) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
}

const getAuthHeaders = () => {
  const token = useAdminAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleAuthError = (res: Response) => {
  if (res.status === 401) {
    useAdminAuthStore.getState().logout();
    throw new Error('Session expired. Please login again.');
  }
};

export const useAdminStore = create<AdminState>((set) => ({
  products: [],
  orders: [],
  studioModels: [],
  contactMessages: [],
  dashboardStats: null,
  loading: false,

  fetchDashboardStats: async () => {
    try {
      const res = await fetch(`${API_URL}/api/dashboard-stats`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        handleAuthError(res);
        return;
      }
      if (res.ok) {
        const dashboardStats = await res.json();
        set({ dashboardStats });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  },

  fetchProducts: async () => {
    try {
      set({ loading: true });
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        const products = await res.json();
        set({ products });
      } else {
        console.error('Failed to fetch products:', res.status);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchOrders: async () => {
    try {
      set({ loading: true });
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        handleAuthError(res);
        return;
      }
      if (res.ok) {
        const orders = await res.json();
        set({ orders });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchStudioModels: async () => {
    try {
      set({ loading: true });
      const res = await fetch(`${API_URL}/api/studio-models`);
      if (res.ok) {
        const studioModels = await res.json();
        set({ studioModels });
      }
    } catch (error) {
      console.error('Failed to fetch studio models:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchContactMessages: async () => {
    try {
      set({ loading: true });
      const res = await fetch(`${API_URL}/api/contact-messages`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        handleAuthError(res);
        return;
      }
      if (res.ok) {
        const contactMessages = await res.json();
        set({ contactMessages });
      }
    } catch (error) {
      console.error('Failed to fetch contact messages:', error);
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (product) => {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    
    if (!res.ok) {
      throw new Error('Failed to add product');
    }
    
    const newProduct = await res.json();
    set((state) => ({ products: [...state.products, newProduct] }));
  },

  updateProduct: async (product) => {
    const res = await fetch(`${API_URL}/api/products/${product.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });
    
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    
    if (!res.ok) {
      throw new Error('Failed to update product');
    }
    
    const updatedProduct = await res.json();
    set((state) => ({
      products: state.products.map((p) =>
        p.id === product.id ? updatedProduct : p
      ),
    }));
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    
    if (!res.ok) {
      throw new Error('Failed to delete product');
    }
    
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  addStudioModel: async (model) => {
    const res = await fetch(`${API_URL}/api/studio-models`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(model),
    });
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    if (!res.ok) throw new Error('Failed to add studio model');
    const newModel = await res.json();
    set((state) => ({ studioModels: [...state.studioModels, newModel] }));
  },

  updateStudioModel: async (model) => {
    const res = await fetch(`${API_URL}/api/studio-models/${model.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(model),
    });
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    if (!res.ok) throw new Error('Failed to update studio model');
    const updated = await res.json();
    set((state) => ({
      studioModels: state.studioModels.map((m) => (m.id === model.id ? updated : m)),
    }));
  },

  deleteStudioModel: async (id) => {
    const res = await fetch(`${API_URL}/api/studio-models/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    if (!res.ok) throw new Error('Failed to delete studio model');
    set((state) => ({
      studioModels: state.studioModels.filter((m) => m.id !== id),
    }));
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    
    if (!res.ok) {
      throw new Error('Failed to update order status');
    }
    
    const updatedOrder = await res.json();
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? updatedOrder : o
      ),
    }));
  },

  updateContactMessageStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/api/contact-messages/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    if (!res.ok) throw new Error('Failed to update message');
    const updated = await res.json();
    set((state) => ({
      contactMessages: state.contactMessages.map((m) =>
        m.id === id ? updated : m
      ),
    }));
  },

  deleteContactMessage: async (id) => {
    const res = await fetch(`${API_URL}/api/contact-messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      handleAuthError(res);
      return;
    }
    if (!res.ok) throw new Error('Failed to delete message');
    set((state) => ({
      contactMessages: state.contactMessages.filter((m) => m.id !== id),
    }));
  },
}));
