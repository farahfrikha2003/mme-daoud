/**
 * Types pour les devis
 */

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface QuoteLine {
  productId: string;
  productName: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tvaRate?: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    postalCode?: string;
    company?: string;
  };
  lines: QuoteLine[];
  subtotal: number;
  tvaAmount: number;
  total: number;
  status: QuoteStatus;
  validUntil: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuoteInput {
  customer: Quote['customer'];
  lines: QuoteLine[];
  subtotal: number;
  tvaAmount: number;
  total: number;
  validUntil: string;
  notes?: string;
}

export interface UpdateQuoteInput {
  status?: QuoteStatus;
  notes?: string;
}
