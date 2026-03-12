/**
 * Types pour les paiements
 */

export type PaymentType = 'full' | 'deposit' | 'balance' | 'refund' | 'adjustment';
export type PaymentMethod = 'cash' | 'card' | 'check' | 'transfer' | 'other';

export interface Payment {
  id: string;
  reference: string;
  orderId?: string;
  invoiceId?: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  referenceNumber?: string; // numéro chèque, référence virement
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface CreatePaymentInput {
  orderId?: string;
  invoiceId?: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  referenceNumber?: string;
  notes?: string;
  createdBy?: string;
}

export interface UpdatePaymentInput {
  amount?: number;
  method?: PaymentMethod;
  paidAt?: string;
  referenceNumber?: string;
  notes?: string;
}
