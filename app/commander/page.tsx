"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart } = useCart();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Rediriger si le panier est vide
    useEffect(() => {
        if (items.length === 0 && !isSuccess) {
            router.push('/panier');
        }
    }, [items, isSuccess, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simuler le traitement de la commande
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSuccess(true);
        setIsSubmitting(false);
        clearCart();
    };

    if (isSuccess) {
        return (
            <div className={styles.successPage}>
                <div className={styles.container}>
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h1 className={styles.successTitle}>Commande Confirmée !</h1>
                        <p className={styles.successText}>
                            Merci pour votre commande. Vous recevrez un email de confirmation avec
                            les détails de votre commande et les informations de livraison.
                        </p>
                        <div className={styles.orderNumber}>
                            Numéro de commande : <span>#{Math.floor(Math.random() * 100000)}</span>
                        </div>
                        <Link href="/" className={styles.backButton}>
                            Retour à l&apos;accueil
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Valider la commande</h1>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Formulaire */}
                        <div className={styles.formSection}>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                {/* Informations de contact */}
                                <div className={styles.sectionBlock}>
                                    <h2 className={styles.blockTitle}>Informations de contact</h2>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Prénom *</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className={styles.input}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Nom *</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className={styles.input}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Téléphone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Adresse de livraison */}
                                <div className={styles.sectionBlock}>
                                    <h2 className={styles.blockTitle}>Adresse de livraison</h2>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Adresse *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Ville *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                className={styles.input}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Code Postal *</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                required
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Notes de commande (optionnel)</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows={3}
                                            className={styles.textarea}
                                        />
                                    </div>
                                </div>

                                {/* Paiement */}
                                <div className={styles.sectionBlock}>
                                    <h2 className={styles.blockTitle}>Paiement</h2>
                                    <div className={styles.paymentMethods}>
                                        <label className={styles.paymentMethod}>
                                            <input type="radio" name="payment" defaultChecked className={styles.radio} />
                                            <div className={styles.paymentInfo}>
                                                <span className={styles.paymentName}>Paiement à la livraison</span>
                                                <span className={styles.paymentDesc}>Payez en espèces à la réception de votre commande</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formActions}>
                                    <Link href="/panier" className={styles.backLink}>
                                        Retour au panier
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={styles.submitButton}
                                    >
                                        {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Récapitulatif Sidebar */}
                        <div className={styles.sidebar}>
                            <div className={styles.orderSummary}>
                                <h2 className={styles.summaryTitle}>Votre Commande</h2>

                                <div className={styles.summaryItems}>
                                    {items.map((item) => (
                                        <div key={item.product.id} className={styles.summaryItem}>
                                            <div className={styles.itemImage}>
                                                <div
                                                    className={styles.placeholderImage}
                                                    style={{
                                                        background: `linear-gradient(135deg, hsl(${30 + parseInt(item.product.id) * 10}, 25%, 85%) 0%, hsl(${35 + parseInt(item.product.id) * 10}, 20%, 75%) 100%)`
                                                    }}
                                                >
                                                    <span className={styles.placeholderText}>{item.product.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <div className={styles.itemName}>{item.product.name}</div>
                                                <div className={styles.itemMeta}>
                                                    {item.quantity}g x {(item.product.isPromo && item.product.promoPrice ? item.product.promoPrice : item.product.price)} DT
                                                </div>
                                            </div>
                                            <div className={styles.itemPrice}>
                                                {((item.product.isPromo && item.product.promoPrice ? item.product.promoPrice : item.product.price) * item.quantity / 100).toFixed(2)} DT
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.divider} />

                                <div className={styles.summaryRow}>
                                    <span>Sous-total</span>
                                    <span>{total.toFixed(2)} DT</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Livraison</span>
                                    <span>Gratuite</span>
                                </div>

                                <div className={styles.divider} />

                                <div className={styles.totalRow}>
                                    <span>Total</span>
                                    <span>{total.toFixed(2)} DT</span>
                                </div>
                            </div>

                            <div className={styles.reassurance}>
                                <div className={styles.reassuranceItem}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="3" width="15" height="13" />
                                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                        <circle cx="5.5" cy="18.5" r="2.5" />
                                        <circle cx="18.5" cy="18.5" r="2.5" />
                                    </svg>
                                    <span>Livraison Rapide</span>
                                </div>
                                <div className={styles.reassuranceItem}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    <span>Produits Frais</span>
                                </div>
                                <div className={styles.reassuranceItem}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <span>Qualité Garantie</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
