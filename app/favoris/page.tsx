"use client";

import React from 'react';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import ProductCard from '@/components/ui/ProductCard';
import styles from './page.module.css';

export default function FavorisPage() {
    const { favorites, clearFavorites } = useFavorites();

    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Mes Favoris</h1>
                    <p className={styles.subtitle}>
                        Retrouvez vos produits préférés
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className={styles.content}>
                <div className={styles.container}>
                    {favorites.length > 0 ? (
                        <>
                            <div className={styles.toolbar}>
                                <span className={styles.count}>{favorites.length} produit{favorites.length > 1 ? 's' : ''}</span>
                                <button onClick={clearFavorites} className={styles.clearButton}>
                                    Tout supprimer
                                </button>
                            </div>
                            <div className={styles.grid}>
                                {favorites.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </div>
                            <h2 className={styles.emptyTitle}>Aucun favori</h2>
                            <p className={styles.emptyText}>
                                Vous n&apos;avez pas encore ajouté de produits à vos favoris.
                            </p>
                            <Link href="/collection" className={styles.emptyButton}>
                                Découvrir nos produits
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
