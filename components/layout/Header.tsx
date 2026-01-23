"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import styles from './Header.module.css';

const navigation = [
    { name: 'Collection', href: '/collection' },
    { name: 'Actualités', href: '/actus' },
    { name: 'Cérémonies', href: '/ceremonies' },
    { name: 'Idées de Cadeaux', href: '/idees-cadeaux' },
    { name: 'Histoire', href: '/notre-histoire' },
    { name: 'Devenez Franchisé', href: '/devenez-franchise' },
    { name: 'Contact', href: '/contact' },
];

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { toggleCart, itemCount, total } = useCart();
    const { favoritesCount } = useFavorites();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/collection?search=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false); // Fermer le menu mobile si ouvert
        }
    };

    return (
        <header className={styles.header}>
            {/* Barre utilitaire */}
            <div className={styles.utilityBar}>
                <div className={styles.container}>
                    <div className={styles.utilityContent}>
                        <Link href="/boutiques" className={styles.utilityLink}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            Trouver une boutique
                        </Link>

                        <div className={styles.utilityActions}>
                            {/* Recherche Desktop */}
                            <div className={styles.searchWrapper}>
                                <form onSubmit={handleSearch} className={styles.searchForm}>
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                    <button type="submit" className={styles.searchButton}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.35-4.35" />
                                        </svg>
                                    </button>
                                </form>
                            </div>

                            <Link href="/mon-compte" className={styles.utilityLink}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Mon compte
                            </Link>

                            <Link href="/favoris" className={styles.utilityLink}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Favoris
                                {favoritesCount > 0 && (
                                    <span className={styles.badge}>{favoritesCount}</span>
                                )}
                            </Link>

                            <button onClick={toggleCart} className={styles.cartButton}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                Panier
                                <span className={styles.cartTotal}>{total.toFixed(2)} DT</span>
                                {itemCount > 0 && (
                                    <span className={styles.badge}>{itemCount}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logo centré */}
            <div className={styles.logoSection}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="Pâtisserie Mme Daoud"
                        width={180}
                        height={120}
                        priority
                    />
                </Link>
            </div>

            {/* Navigation principale */}
            <nav className={styles.nav}>
                <div className={styles.container}>
                    {/* Bouton menu mobile */}
                    <button
                        className={styles.menuToggle}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <ul className={`${styles.navList} ${isMenuOpen ? styles.navListOpen : ''}`}>
                        {/* Barre de recherche dans le menu mobile */}
                        <li className={styles.mobileSearch}>
                            <form onSubmit={handleSearch} className={styles.searchForm}>
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.searchInput}
                                />
                                <button type="submit" className={styles.searchButton}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                    </svg>
                                </button>
                            </form>
                        </li>
                        {navigation.map((item) => (
                            <li key={item.name} className={styles.navItem}>
                                <Link href={item.href} className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="/catalogue.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.catalogButton}
                    >
                        Catalogue
                    </a>
                </div>
            </nav>

            {/* Overlay menu mobile */}
            {isMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    );
}
