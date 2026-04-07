import { getJson } from './client';

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

export const fetchProducts = () => getJson<Product[]>('/products');
export const fetchInventory = () => getJson<InventoryData>('/inventory');
export const fetchGallery = () => getJson<GalleryItem[]>('/gallery');
