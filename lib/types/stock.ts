/**
 * Types pour la gestion de stock
 */

export type StockMovementType = 'in' | 'out' | 'adjustment' | 'transfer';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  unit: string;
  reason?: string;
  reference?: string; // bon de livraison, facture fournisseur, etc.
  supplierId?: string;
  orderId?: string;
  createdAt: string;
  createdBy?: string;
}

export interface ProductStock {
  productId: string;
  productName: string;
  currentQuantity: number;
  unit: string;
  minThreshold?: number;
  lastMovementAt?: string;
}

export interface CreateStockMovementInput {
  productId: string;
  productName?: string;
  type: StockMovementType;
  quantity: number;
  unit: string;
  reason?: string;
  reference?: string;
  supplierId?: string;
  orderId?: string;
  createdBy?: string;
}
