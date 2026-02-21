import { z } from 'zod';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

export const smartOrderSchema = z.object({
  brickType: z.enum(['Avval', 'Second', 'Rora']),
  usagePurpose: z.enum(['House', 'Boundary', 'Filling']),
  quantityUnit: z.enum(['bricks', 'trolleys']),
  quantityValue: z.number().positive(),
  deliveryArea: z.string().min(2),
  landmark: z.string().max(200).optional().or(z.literal('')),
  distanceRange: z.enum(['0-10km', '10-25km', '25+km']),
  requiredDeliveryDate: z.string().min(1),
  urgency: z.enum(['immediate', 'flexible']),
  name: z.string().min(2),
  phoneNumber: z.string().min(10),
  email: z.string().email(),
  whatsappNumber: z.string().min(10).optional().or(z.literal('')),
  isWhatsappSame: z.boolean(),
});

export type SmartOrderPayload = z.infer<typeof smartOrderSchema>;

export interface SmartOrderResponse {
  success: boolean;
  message: string;
  data?: {
    order: any;
    leadPriority: 'hot' | 'warm' | 'normal';
    stock: {
      availableBricks: number;
      requestedBricks: number;
      limited: boolean;
    };
    estimate: {
      min: number;
      max: number;
    };
    adminWhatsAppUrl: string;
  };
}

export const submitSmartOrder = async (payload: SmartOrderPayload): Promise<SmartOrderResponse> => {
  const response = await fetch(`${apiBaseUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || 'Failed to submit order');
  }

  return result;
};
