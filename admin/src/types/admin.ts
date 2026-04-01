import { Product } from '../data/products';

export type OrderStatus = 'pending' | 'processed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  customer: CustomerInfo;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

export type ContactMessageStatus = 'new' | 'read' | 'archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}