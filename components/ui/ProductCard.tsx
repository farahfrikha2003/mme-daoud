"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@/lib/types/product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, product.minQuantity);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
    };

    const displayPrice = product.isPromo && product.promoPrice
        ? product.promoPrice
        : product.price;

    return (
        <Link href={`/produit/${product.slug}`} className={styles.card}>
            {/* Image container */}
            <div className={styles.imageContainer}>
                {product.images && product.images.length > 0 ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div
                        className={styles.placeholderImage}
                        style={{
                            background: `linear-gradient(135deg, hsl(${30 + parseInt(product.id) * 10}, 25%, 85%) 0%, hsl(${35 + parseInt(product.id) * 10}, 20%, 75%) 100%)`
                        }}
                    >
                        <span className={styles.placeholderText}>{product.name.charAt(0)}</span>
                    </div>
                )}

                {/* Badges */}
                <div className={styles.badges}>
                    {product.isNew && (
                        <span className={`${styles.badge} ${styles.badgeNew}`}>Nouveau</span>
                    )}
                    {product.isPromo && (
                        <span className={`${styles.badge} ${styles.badgePromo}`}>Promo</span>
                    )}
                    {product.isGlutenFree && (
                        <span className={`${styles.badge} ${styles.badgeGluten}`}>Sans Gluten</span>
                    )}
                </div>

                {/* Favorite button */}
                <button
                    onClick={handleToggleFavorite}
                    className={`${styles.favoriteButton} ${isFavorite(product.id) ? styles.favoriteActive : ''}`}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Add to cart overlay */}
                <button onClick={handleAddToCart} className={styles.addToCartOverlay}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Ajouter au panier
                </button>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.priceRow}>
                    {product.isPromo && product.promoPrice ? (
                        <>
                            <span className={styles.originalPrice}>{product.price} DT</span>
                            <span className={styles.price}>{product.promoPrice} DT</span>
                        </>
                    ) : (
                        <span className={styles.price}>{displayPrice} DT</span>
                    )}
                    <span className={styles.unit}>/{product.priceUnit}</span>
                </div>
            </div>
        </Link>
    );
}
