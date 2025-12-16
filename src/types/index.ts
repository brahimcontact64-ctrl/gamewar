import { ReactNode } from "react";

export type UserRole = 'guest' | 'user' | 'seller' | 'admin';
export type UserStatus = 'pending' | 'active' | 'suspended';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  credit: number;
  createdAt: Date;
  displayName?: string;
}

export interface Product {
  stockHistory: never[];
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  description: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CartItem {
  price: number;
  name: ReactNode;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: Date;
  deliveryAddress?: string;
  phone?: string;
  notes?: string;
}

export interface CreditLog {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'abandoned_cart' | 'spam' | 'admin_adjustment';
  reason: string;
  createdAt: Date;
}

export type Language = 'fr' | 'ar';
