"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart();

    const handleQuantityChange = (productId: string, currentQuantity: number, delta: number) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity <= 0) {
            removeItem(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayActive : ''}`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Panier
                        {itemCount > 0 && <span className={styles.itemCount}>({itemCount})</span>}
                    </h2>
                    <button onClick={closeCart} className={styles.closeButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    {items.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <p>Votre panier est vide</p>
                            <Link href="/collection" className={styles.shopLink} onClick={closeCart}>
                                Découvrir nos produits
                            </Link>
                        </div>
                    ) : (
                        <ul className={styles.itemsList}>
                            {items.map((item) => (
                                <li key={item.product.id} className={styles.cartItem}>
                                    <div className={styles.itemImage}>
                                        <Image
                                            src={item.product.images[0] || '/images/placeholder.jpg'}
                                            alt={item.product.name}
                                            width={80}
                                            height={80}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <Link
                                            href={`/produit/${item.product.slug}`}
                                            className={styles.itemName}
                                            onClick={closeCart}
                                        >
                                            {item.product.name}
                                        </Link>
                                        <p className={styles.itemPrice}>
                                            {item.product.isPromo && item.product.promoPrice
                                                ? item.product.promoPrice
                                                : item.product.price} DT/{item.product.priceUnit}
                                        </p>
                                        <div className={styles.itemQuantity}>
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, item.quantity, -100)}
                                                className={styles.quantityButton}
                                            >
                                                -
                                            </button>
                                            <span className={styles.quantityValue}>{item.quantity}g</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, item.quantity, 100)}
                                                className={styles.quantityButton}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <p className={styles.itemTotal}>
                                            {((item.product.isPromo && item.product.promoPrice
                                                ? item.product.promoPrice
                                                : item.product.price) * item.quantity / 100).toFixed(2)} DT
                                        </p>
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className={styles.removeButton}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.subtotal}>
                            <span>Sous-total</span>
                            <span className={styles.subtotalValue}>{total.toFixed(2)} DT</span>
                        </div>
                        <p className={styles.shippingNote}>
                            Frais de livraison calculés à la commande
                        </p>
                        <div className={styles.actions}>
                            <Link href="/panier" className={styles.viewCartButton} onClick={closeCart}>
                                Voir le panier
                            </Link>
                            <Link href="/commander" className={styles.checkoutButton} onClick={closeCart}>
                                Commander
                            </Link>
                        </div>
                        <button onClick={closeCart} className={styles.continueLink}>
                            Continuer mes achats
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
