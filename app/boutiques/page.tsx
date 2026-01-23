"use client";

import React from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import styles from './page.module.css';

export default function BoutiquesPage() {
    const plusCode = "QMHR+CQ, Sfax";
    const mapQuery = encodeURIComponent(plusCode);

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Nos Boutiques</h1>
                    <p className={styles.subtitle}>Retrouvez l'excellence de Mme Daoud près de chez vous</p>
                </header>

                <div className={styles.contentGrid}>
                    <div className={styles.infoCard}>
                        <div className={styles.shopInfo}>
                            <h2 className={styles.shopName}>Boutique Sfax</h2>

                            <div className={styles.infoItem}>
                                <MapPin className={styles.icon} size={24} />
                                <div className={styles.infoText}>
                                    <h3>Adresse</h3>
                                    <p>QMHR+CQ, Sfax</p>
                                    <p>Tunisie</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Clock className={styles.icon} size={24} />
                                <div className={styles.infoText}>
                                    <h3>Horaires</h3>
                                    <p>Lundi - Samedi : 08:30 – 19:30</p>
                                    <p>Dimanche : 08:30 – 14:00</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <Phone className={styles.icon} size={24} />
                                <div className={styles.infoText}>
                                    <h3>Téléphone</h3>
                                    <p>+216 74 000 000</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cta}>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.directionsButton}
                            >
                                <Navigation size={18} />
                                Obtenir l'itinéraire
                            </a>
                        </div>
                    </div>

                    <div className={styles.mapWrapper}>
                        {/* Utilisation de l'embed standard sans clé API pour une fiabilité maximale */}
                        <iframe
                            className={styles.map}
                            title="Emplacement Boutique Mme Daoud"
                            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </main>
    );
}
