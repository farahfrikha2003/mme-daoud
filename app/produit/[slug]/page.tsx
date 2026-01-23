"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@/lib/types/product';
import { use } from 'react';
import styles from './page.module.css';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const resolvedParams = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(100);
    const [activeTab, setActiveTab] = useState<'description' | 'composition' | 'conservation'>('description');

    const { addItem } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${resolvedParams.slug}`);
                const data = await response.json();
                if (data.success) {
                    setProduct(data.data);
                    setQuantity(data.data.minQuantity || 100);
                } else {
                    setError(data.error || 'Produit non trouvé');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Une erreur est survenue lors du chargement du produit');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [resolvedParams.slug]);

    if (isLoading) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.container}>
                    <p>Chargement du produit...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.errorPage}>
                <div className={styles.container}>
                    <h1>Oups !</h1>
                    <p>{error || 'Ce produit n\'est pas disponible.'}</p>
                    <Link href="/collection" className={styles.backButton}>
                        Retour à la collection
                    </Link>
                </div>
            </div>
        );
    }

    const piecesCount = Math.round(quantity * (product.piecesPerHundredGrams || 5) / 100);
    const totalPrice = (product.price * quantity / 100).toFixed(2);

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= product.minQuantity && newQuantity <= 5000) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    return (
        <div className={styles.page}>
            {/* Breadcrumbs */}
            <div className={styles.breadcrumbs}>
                <div className={styles.container}>
                    <Link href="/">Accueil</Link>
                    <span>/</span>
                    <Link href="/collection">Collection</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>
            </div>

            {/* Product Section */}
            <section className={styles.productSection}>
                <div className={styles.container}>
                    <div className={styles.productGrid}>
                        {/* Product Image */}
                        <div className={styles.imageColumn}>
                            <div className={styles.mainImage}>
                                {product.images && product.images.length > 0 ? (
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            priority
                                            className={styles.actualImage}
                                        />
                                    </div>
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
                                {product.isNew && (
                                    <span className={styles.badge}>Nouveau</span>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className={styles.infoColumn}>
                            <h1 className={styles.productName}>{product.name}</h1>

                            <div className={styles.priceRow}>
                                <span className={styles.price}>{product.price} DT</span>
                                <span className={styles.priceUnit}>/ {product.priceUnit}</span>
                            </div>

                            {product.isGlutenFree && (
                                <span className={styles.glutenFreeBadge}>Sans Gluten</span>
                            )}

                            {/* Quantity Calculator */}
                            <div className={styles.quantitySection}>
                                <h3 className={styles.quantityTitle}>Choisir la quantité</h3>
                                <div className={styles.quantityControls}>
                                    <button
                                        onClick={() => handleQuantityChange(-100)}
                                        className={styles.quantityButton}
                                        disabled={quantity <= product.minQuantity}
                                    >
                                        -
                                    </button>
                                    <div className={styles.quantityDisplay}>
                                        <span className={styles.quantityValue}>{quantity}g</span>
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange(100)}
                                        className={styles.quantityButton}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className={styles.quantityInfo}>
                                    <span>≈ {piecesCount} pièce{piecesCount > 1 ? 's' : ''}</span>
                                    <span className={styles.totalPrice}>= {totalPrice} DT</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className={styles.actions}>
                                <button onClick={handleAddToCart} className={styles.addToCartButton}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                    Ajouter au panier
                                </button>
                                <button
                                    onClick={() => toggleFavorite(product)}
                                    className={`${styles.favoriteButton} ${isFavorite(product.id) ? styles.favoriteActive : ''}`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className={styles.tabs}>
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('composition')}
                                    className={`${styles.tab} ${activeTab === 'composition' ? styles.tabActive : ''}`}
                                >
                                    Composition
                                </button>
                                <button
                                    onClick={() => setActiveTab('conservation')}
                                    className={`${styles.tab} ${activeTab === 'conservation' ? styles.tabActive : ''}`}
                                >
                                    Conservation
                                </button>
                            </div>

                            <div className={styles.tabContent}>
                                {activeTab === 'description' && (
                                    <p>{product.description}</p>
                                )}
                                {activeTab === 'composition' && (
                                    <p>{product.composition}</p>
                                )}
                                {activeTab === 'conservation' && (
                                    <p>{product.conservation}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
