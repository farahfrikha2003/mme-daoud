/**
 * Types pour les bons de livraison
 */

export type DeliveryNoteStatus = 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface DeliveryNoteLine {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  quantityDelivered?: number;
}

export interface DeliveryNote {
  id: string;
  deliveryNumber: string;
  orderId: string;
  invoiceId?: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  lines: DeliveryNoteLine[];
  status: DeliveryNoteStatus;
  deliveryDate?: string;
  deliveredAt?: string;
  carrier?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryNoteInput {
  orderId: string;
  invoiceId?: string;
  customer: DeliveryNote['customer'];
  lines: DeliveryNoteLine[];
  deliveryDate?: string;
  carrier?: string;
  notes?: string;
}

export interface UpdateDeliveryNoteInput {
  status?: DeliveryNoteStatus;
  quantityDelivered?: { productId: string; quantity: number }[];
  deliveredAt?: string;
  trackingNumber?: string;
  notes?: string;
}
