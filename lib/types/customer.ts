export interface Customer {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    isActive: boolean;
}

export interface CustomerSafe {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    isActive: boolean;
}

export interface RegisterInput {
    email: string;
    password: string;
    username?: string;
    firstName?: string;
    lastName?: string;
}

export interface LoginInput {
    identifier: string; // email or username
    password: string;
}
