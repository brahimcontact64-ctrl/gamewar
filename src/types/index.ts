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
  categoryId: string;
  isActive: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CartItem {
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

export interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
  icon: string;
  key: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  storeName: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  workingHours?: string;
  socialLinks?: {
    facebook: string;
    instagram: string;
    whatsapp: string;
    tiktok: string;
    youtube: string;
  };
  updatedAt: Date;
}

export type Language = 'fr' | 'ar';
