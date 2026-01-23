"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSafe } from '@/lib/types/admin';

interface AdminContextType {
    admin: AdminSafe | null;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshAdmin: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<AdminSafe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchAdmin = async () => {
        try {
            const response = await fetch('/api/admin/auth/me');
            const data = await response.json();

            if (data.success) {
                setAdmin(data.data);
            } else {
                setAdmin(null);
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            }
        } catch {
            setAdmin(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pathname !== '/admin/login') {
            fetchAdmin();
        } else {
            setIsLoading(false);
        }
    }, [pathname]);

    const logout = async () => {
        try {
            await fetch('/api/admin/auth/logout', { method: 'POST' });
        } finally {
            setAdmin(null);
            router.push('/admin/login');
        }
    };

    const refreshAdmin = async () => {
        await fetchAdmin();
    };

    return (
        <AdminContext.Provider value={{ admin, isLoading, logout, refreshAdmin }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
