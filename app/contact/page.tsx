"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

const stores = [
    {
        city: 'Tunis',
        locations: [
            {
                name: 'Menzeh 6',
                address: '48 Avenue XX, Menzeh 6, 2091 Tunis',
                phone: '+216 00 000 000',
                hours: 'Lun-Sam: 9h-19h'
            }
        ]
    },
    {
        city: 'Sfax',
        locations: [
            {
                name: 'Centre Ville',
                address: 'Avenue Principale, Sfax',
                phone: '+216 00 000 001',
                hours: 'Lun-Sam: 9h-19h'
            }
        ]
    },
    {
        city: 'Sousse',
        locations: [
            {
                name: 'Résidence Corniche',
                address: 'Route Touristique, Sousse',
                phone: '+216 00 000 002',
                hours: 'Lun-Sam: 9h-19h'
            }
        ]
    }
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        civility: 'Mme',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({
            civility: 'Mme',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });

        setTimeout(() => setSubmitStatus('idle'), 5000);
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Contact</h1>
                    <p className={styles.subtitle}>Nous sommes à votre écoute</p>
                </div>
            </section>

            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.layout}>
                        {/* Contact Form */}
                        <div className={styles.formSection}>
                            <h2 className={styles.sectionTitle}>Envoyez-nous un message</h2>

                            {submitStatus === 'success' && (
                                <div className={styles.successMessage}>
                                    ✓ Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Civilité</label>
                                        <select
                                            name="civility"
                                            value={formData.civility}
                                            onChange={handleChange}
                                            className={styles.select}
                                        >
                                            <option value="M.">M.</option>
                                            <option value="Mme">Mme</option>
                                            <option value="Mlle">Mlle</option>
                                        </select>
                                    </div>
                                </div>

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
                                        <label className={styles.label}>Téléphone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Sujet *</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className={styles.select}
                                    >
                                        <option value="">Choisir un sujet</option>
                                        <option value="commande">Question sur une commande</option>
                                        <option value="produit">Question sur un produit</option>
                                        <option value="franchise">Devenir franchisé</option>
                                        <option value="partenariat">Partenariat</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className={styles.textarea}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={styles.submitButton}
                                >
                                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                                </button>
                            </form>
                        </div>

                        {/* Stores */}
                        <div className={styles.storesSection}>
                            <h2 className={styles.sectionTitle}>Nos Boutiques</h2>

                            <div className={styles.storesList}>
                                {stores.map((store) => (
                                    <div key={store.city} className={styles.storeCity}>
                                        <h3 className={styles.cityName}>{store.city}</h3>
                                        {store.locations.map((location, index) => (
                                            <div key={index} className={styles.storeCard}>
                                                <h4 className={styles.storeName}>{location.name}</h4>
                                                <div className={styles.storeInfo}>
                                                    <div className={styles.storeInfoItem}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                        <span>{location.address}</span>
                                                    </div>
                                                    <div className={styles.storeInfoItem}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                        </svg>
                                                        <a href={`tel:${location.phone}`}>{location.phone}</a>
                                                    </div>
                                                    <div className={styles.storeInfoItem}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        <span>{location.hours}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Info Box */}
                            <div className={styles.infoBox}>
                                <h3 className={styles.infoTitle}>Pour vous satisfaire !</h3>
                                <p className={styles.infoText}>
                                    Nous vous offrons des produits de qualité et une meilleure expérience client.
                                </p>
                                <div className={styles.infoStats}>
                                    <div className={styles.infoStat}>
                                        <span className={styles.infoStatNumber}>40+</span>
                                        <span className={styles.infoStatLabel}>Ans d&apos;expérience</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
