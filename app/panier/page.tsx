"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CartPage() {
    const { items, updateQuantity, removeItem, total, itemCount, clearCart } = useCart();

    const handleQuantityChange = (productId: string, currentQuantity: number, delta: number) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity <= 0) {
            if (window.confirm('Voulez-vous retirer ce produit du panier ?')) {
                removeItem(productId);
            }
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    if (items.length === 0) {
        return (
            <div className={styles.emptyPage}>
                <div className={styles.container}>
                    <div className={styles.emptyContent}>
                        <div className={styles.emptyIcon}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                        </div>
                        <h1 className={styles.emptyTitle}>Votre panier est vide</h1>
                        <p className={styles.emptyText}>
                            Il semble que vous n&apos;ayez pas encore ajouté de délicieuses pâtisseries à votre panier.
                        </p>
                        <Link href="/collection" className={styles.emptyButton}>
                            Découvrir notre collection
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Mon Panier</h1>
                    <p className={styles.subtitle}>
                        {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
                    </p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Cart Items */}
                        <div className={styles.itemsSection}>
                            <div className={styles.tableHeader}>
                                <span className={styles.colProduct}>Produit</span>
                                <span className={styles.colPrice}>Prix</span>
                                <span className={styles.colQuantity}>Quantité</span>
                                <span className={styles.colTotal}>Total</span>
                                <span className={styles.colAction}></span>
                            </div>

                            <div className={styles.itemsList}>
                                {items.map((item) => {
                                    const price = item.product.isPromo && item.product.promoPrice
                                        ? item.product.promoPrice
                                        : item.product.price;
                                    const itemTotal = (price * item.quantity / 100);

                                    return (
                                        <div key={item.product.id} className={styles.itemRow}>
                                            <div className={styles.productInfo}>
                                                <div className={styles.productImage}>
                                                    <div
                                                        className={styles.placeholderImage}
                                                        style={{
                                                            background: `linear-gradient(135deg, hsl(${30 + parseInt(item.product.id) * 10}, 25%, 85%) 0%, hsl(${35 + parseInt(item.product.id) * 10}, 20%, 75%) 100%)`
                                                        }}
                                                    >
                                                        <span className={styles.placeholderText}>{item.product.name.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.productDetails}>
                                                    <Link href={`/produit/${item.product.slug}`} className={styles.productName}>
                                                        {item.product.name}
                                                    </Link>
                                                    <span className={styles.productUnit}>Prix au {item.product.priceUnit}</span>
                                                </div>
                                            </div>

                                            <div className={styles.priceInfo}>
                                                <span className={styles.priceValue}>{price.toFixed(2)} DT</span>
                                            </div>

                                            <div className={styles.quantityInfo}>
                                                <div className={styles.quantityControls}>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity, -100)}
                                                        className={styles.quantityBtn}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={styles.quantityValue}>{item.quantity}g</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity, 100)}
                                                        className={styles.quantityBtn}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.totalInfo}>
                                                <span className={styles.totalValue}>{itemTotal.toFixed(2)} DT</span>
                                            </div>

                                            <div className={styles.actionInfo}>
                                                <button
                                                    onClick={() => removeItem(item.product.id)}
                                                    className={styles.removeBtn}
                                                    title="Supprimer"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.cartActions}>
                                <Link href="/collection" className={styles.continueLink}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    Continuer mes achats
                                </Link>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
                                            clearCart();
                                        }
                                    }}
                                    className={styles.clearBtn}
                                >
                                    Vider le panier
                                </button>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className={styles.summarySection}>
                            <div className={styles.summaryCard}>
                                <h2 className={styles.summaryTitle}>Récapitulatif</h2>

                                <div className={styles.summaryRow}>
                                    <span>Sous-total</span>
                                    <span>{total.toFixed(2)} DT</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Livraison</span>
                                    <span className={styles.shippingText}>Calculé à l&apos;étape suivante</span>
                                </div>

                                <div className={styles.divider} />

                                <div className={styles.totalRow}>
                                    <span>Total</span>
                                    <span>{total.toFixed(2)} DT</span>
                                </div>

                                <p className={styles.taxNote}>Taxes incluses</p>

                                <Link href="/commander" className={styles.checkoutBtn}>
                                    Procéder au paiement
                                </Link>

                                <div className={styles.securityNote}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <span>Paiement sécurisé</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
