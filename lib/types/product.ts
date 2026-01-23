/**
 * Types pour les produits de pâtisserie
 */

export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    composition: string;
    conservation: string;
    price: number; // Prix par 100g
    priceUnit: string; // "100g" par défaut
    category: string;
    categorySlug: string;
    images: string[];
    isNew: boolean;
    isPromo: boolean;
    promoPrice?: number;
    isFeatured: boolean;
    isGlutenFree: boolean;
    piecesPerHundredGrams: number; // Nombre de pièces approximatif pour 100g
    minQuantity: number; // Quantité minimum en grammes
    stock: 'in_stock' | 'low_stock' | 'out_of_stock';
    recipe?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    slug: string;
    name: string;
    description: string;
    image: string;
    order: number;
    parentId?: string;
}

export interface CartItem {
    product: Product;
    quantity: number; // En grammes
}

export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    isGlutenFree?: boolean;
    isFeatured?: boolean;
    sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest';
}

export interface PaginatedProducts {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ContactFormData {
    civility: 'M.' | 'Mme' | 'Mlle';
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    subject: string;
    message: string;
}

export interface Store {
    id: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    hours: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}
