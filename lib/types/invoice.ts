/**
 * Types pour les factures
 */

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceLine {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  tvaRate?: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  quoteId?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    tvaNumber?: string;
  };
  lines: InvoiceLine[];
  subtotal: number;
  tvaAmount: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceInput {
  orderId?: string;
  quoteId?: string;
  customer: Invoice['customer'];
  lines: InvoiceLine[];
  subtotal: number;
  tvaAmount: number;
  total: number;
  dueDate: string;
  notes?: string;
}

export interface UpdateInvoiceInput {
  status?: InvoiceStatus;
  paidAt?: string;
  notes?: string;
}
