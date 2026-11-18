import { API } from './client';

export interface Product {
  _id: string;
  productId?: string;
  productCode?: string;
  name: string;
  localName?: string;
  alternativeNames?: string[];
  slug: string;
  grade?: string;
  category?: string;
  badge?: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  type: string;
  pricePerBrick: number;
  pricePer1000: number;
  pricePerTrolley: number;
  pricingUnit?: string;
  characteristics?: string[];
  recommendedApplications?: string[];
  colourDescription?: string;
  soundDescription?: string;
  strengthLevel?: string;
  usageTags: string[];
  qualityGrade: string;
  availabilityStatus?: string;
  availability?: boolean;
  isActive: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  stockQuantity?: number;
}

export interface GradeInventoryItem {
  grade: string;
  productName: string;
  localName?: string;
  availableQuantity: number;
  reservedQuantity: number;
  dispatchedQuantity: number;
  stockStatus: string;
  internalRemarks?: string;
  lastUpdated?: string;
}

export interface InventoryData {
  totalBricks: number;
  availableTrolleys?: number;
  items?: GradeInventoryItem[];
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
