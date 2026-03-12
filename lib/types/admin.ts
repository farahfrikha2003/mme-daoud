/**
 * Types pour l'administration
 */

// Roles administrateur
export type AdminRole = 'super_admin' | 'admin';

// Admin utilisateur
export interface Admin {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: AdminRole;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
}

// Admin sans mot de passe (pour les réponses API)
export type AdminSafe = Omit<Admin, 'passwordHash'>;

// Création d'admin
export interface CreateAdminInput {
    username: string;
    email: string;
    password: string;
    role: AdminRole;
    firstName?: string;
    lastName?: string;
}

// Mise à jour d'admin
export interface UpdateAdminInput {
    username?: string;
    email?: string;
    password?: string;
    role?: AdminRole;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
}

// Session admin
export interface AdminSession {
    id: string;
    adminId: string;
    token: string;
    createdAt: string;
    expiresAt: string;
}

// JWT Payload
export interface JwtPayload {
    adminId: string;
    username: string;
    role: AdminRole;
    iat: number;
    exp: number;
}

// Statuts de commande
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Client d'une commande
export interface OrderCustomer {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

// Item d'une commande
export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

// Événement historique d'une commande
export interface OrderHistoryEvent {
    status: OrderStatus;
    timestamp: string;
    adminId?: string;
    note?: string;
}

// Commande complète
export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    customer: OrderCustomer;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    notes?: string;
    history: OrderHistoryEvent[];
    createdAt: string;
    updatedAt: string;
}

// Types d'actions pour les logs
export type LogAction =
    | 'login'
    | 'logout'
    | 'create'
    | 'update'
    | 'delete'
    | 'toggle'
    | 'upload'
    | 'status_change'
    | 'view';

// Types d'entités pour les logs
export type LogEntity = 'admin' | 'category' | 'product' | 'order' | 'session' | 'system' | 'employee'
    | 'invoice' | 'quote' | 'delivery_note' | 'payment' | 'supplier' | 'stock' | 'settings';

// Log d'action
export interface ActionLog {
    id: string;
    adminId: string;
    adminUsername: string;
    action: LogAction;
    entity: LogEntity;
    entityId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
}

// Création de log
export interface CreateLogInput {
    adminId: string;
    adminUsername: string;
    action: LogAction;
    entity: LogEntity;
    entityId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
}

// Statistiques du dashboard
export interface DashboardStats {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
    topProducts: { productId: string; productName: string; count: number }[];
}

// Filtres pour les listes
export interface AdminFilters {
    search?: string;
    role?: AdminRole;
    isActive?: boolean;
}

export interface OrderFilters {
    search?: string;
    status?: OrderStatus;
    dateFrom?: string;
    dateTo?: string;
}

export interface LogFilters {
    adminId?: string;
    action?: LogAction;
    entity?: LogEntity;
    dateFrom?: string;
    dateTo?: string;
}

// Réponse API standard
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Réponse paginée
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
