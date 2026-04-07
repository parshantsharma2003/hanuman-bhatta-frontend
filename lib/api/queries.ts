import { API } from './client';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  pricePer1000: number;
  pricePerTrolley: number;
  imageUrl?: string;
  usageTags: string[];
  qualityGrade: 'First' | 'Second' | 'Rora';
  isActive: boolean;
}

export interface InventoryData {
  totalBricks: number;
  availableTrolleys?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface GalleryItem {
  _id: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  mediaUrl: string;
  publicId: string;
  createdAt: string;
}

export const queryKeys = {
  products: ['products'] as const,
  inventory: ['inventory'] as const,
  gallery: ['gallery'] as const,
};

export const fetchProducts = async () => {
  const response = await API.get<{ success: boolean; data: Product[] }>('/products');
  return response.data.data;
};

export const fetchInventory = async () => {
  const response = await API.get<{ success: boolean; data: InventoryData }>('/inventory');
  return response.data.data;
};

export const fetchGallery = async () => {
  const response = await API.get<{ success: boolean; data: GalleryItem[] }>('/gallery');
  return response.data.data;
};
