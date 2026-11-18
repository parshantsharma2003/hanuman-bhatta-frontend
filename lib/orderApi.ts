import { z } from 'zod';
import { API } from './api/client';

export const smartOrderSchema = z.object({
  brickType: z.string().min(1, 'Please select a brick grade'),
  usagePurpose: z.string().default('House'),
  quantityUnit: z.enum(['bricks', 'trolleys']),
  quantityValue: z.number().positive('Quantity must be greater than zero'),
  deliveryType: z.enum(['delivery', 'self_pickup']).default('delivery'),
  deliveryArea: z.string().min(2, 'Delivery location or address is required'),
  village: z.string().optional().or(z.literal('')),
  district: z.string().optional().or(z.literal('')),
  pincode: z.string().optional().or(z.literal('')),
  landmark: z.string().max(200).optional().or(z.literal('')),
  distanceRange: z.string().default('0-10km'),
  requiredDeliveryDate: z.string().min(1, 'Delivery date is required'),
  urgency: z.enum(['immediate', 'flexible']).default('flexible'),
  name: z.string().min(2, 'Customer name is required'),
  phoneNumber: z.string().min(10, 'Valid 10-digit mobile number required'),
  email: z.string().email('Valid email address required'),
  whatsappNumber: z.string().min(10).optional().or(z.literal('')),
  isWhatsappSame: z.boolean().default(true),
  customerInstructions: z.string().optional().or(z.literal('')),
});

export type SmartOrderPayload = z.infer<typeof smartOrderSchema>;

export interface SmartOrderResponse {
  success: boolean;
  message: string;
  data?: {
    order: any;
    orderNumber?: string;
    leadPriority: 'hot' | 'warm' | 'normal';
    product?: {
      name: string;
      localName?: string;
      grade?: string;
      pricePerBrick?: number;
      pricePer1000?: number;
    };
    estimate?: {
      subtotal?: number;
      min?: number;
      max?: number;
      pricePerBrick?: number;
      quantityBricks?: number;
      isIndicative?: boolean;
    };
    adminWhatsAppUrl: string;
  };
}

export const submitSmartOrder = async (payload: SmartOrderPayload): Promise<SmartOrderResponse> => {
  try {
    const response = await API.post<SmartOrderResponse>('/orders', payload);
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to submit order');
  }
};
