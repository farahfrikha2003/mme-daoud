/**
 * Types pour les fournisseurs
 */

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  tvaNumber?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierInput {
  name: string;
  contactName?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  tvaNumber?: string;
  notes?: string;
}

export interface UpdateSupplierInput extends Partial<CreateSupplierInput> {
  isActive?: boolean;
}
