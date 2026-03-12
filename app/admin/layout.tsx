"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import { AdminLayoutWrapper } from './AdminLayoutWrapper';
import styles from './layout.module.css';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/categories', label: 'Catégories', icon: '📂' },
    { href: '/admin/products', label: 'Produits', icon: '🍰' },
    { href: '/admin/news', label: 'Actualités', icon: '📰' },
    { href: '/admin/employees', label: 'Employés', icon: '👥' },
    { href: '/admin/orders', label: 'Commandes', icon: '📦' },
    { href: '/admin/invoices', label: 'Factures', icon: '🧾' },
    { href: '/admin/quotes', label: 'Devis', icon: '📝' },
    { href: '/admin/delivery-notes', label: 'Bons de livraison', icon: '🚚' },
    { href: '/admin/payments', label: 'Paiements', icon: '💳' },
    { href: '/admin/suppliers', label: 'Fournisseurs', icon: '🏭' },
    { href: '/admin/stock', label: 'Gestion de stock', icon: '📦' },
    { href: '/admin/reports', label: 'Rapports', icon: '📈' },
    { href: '/admin/clients', label: 'Clients', icon: '👤' },
    { href: '/admin/logs', label: 'Logs', icon: '📋' },
    { href: '/admin/parametres', label: 'Paramètres', icon: '⚙️' },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { admin, isLoading, logout } = useAdmin();
    const pathname = usePathname();

    // Ne pas afficher le layout sur la page login
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Chargement...</p>
            </div>
        );
    }

    if (!admin) {
        return null; // Redirect handled by context
    }

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/logo.png"
                            alt="Logo Mme Daoud"
                            width={160}
                            height={80}
                            className={styles.sidebarLogo}
                            priority
                        />
                    </div>
                    <span className={styles.adminBadge}>Admin Panel</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.viewSite}>
                        🌐 Voir le site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className={styles.main}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>
                            {navItems.find(i => i.href === pathname || (i.href !== '/admin' && pathname?.startsWith(i.href + '/')))?.label || 'Administration'}
                        </h1>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.adminInfo}>
                            <span className={styles.adminName}>{admin.username}</span>
                            <span className={styles.adminRole}>{admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
                        </div>
                        <button onClick={logout} className={styles.logoutButton}>
                            Déconnexion
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayoutWrapper>
            <AdminProvider>
                <AdminLayoutContent>{children}</AdminLayoutContent>
            </AdminProvider>
        </AdminLayoutWrapper>
    );
}
