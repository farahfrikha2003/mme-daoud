import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const ceremonies = [
    {
        id: '1',
        title: 'Mariages',
        description: 'Sublimez votre mariage avec nos pâtisseries traditionnelles. Coffrets personnalisés pour vos invités.',
        icon: '💒'
    },
    {
        id: '2',
        title: 'Fiançailles',
        description: 'Célébrez vos fiançailles avec élégance grâce à nos créations raffinées.',
        icon: '💍'
    },
    {
        id: '3',
        title: 'Circoncisions',
        description: 'Des assortiments spéciaux pour marquer ce moment important.',
        icon: '👶'
    },
    {
        id: '4',
        title: 'Fêtes Religieuses',
        description: 'Aïd, Ramadan... Nos pâtisseries accompagnent vos célébrations.',
        icon: '🌙'
    },
    {
        id: '5',
        title: 'Anniversaires',
        description: 'Faites de chaque anniversaire un moment délicieux avec nos coffrets.',
        icon: '🎂'
    },
    {
        id: '6',
        title: 'Événements Corporate',
        description: 'Impressionnez vos clients et partenaires avec nos sélections professionnelles.',
        icon: '🏢'
    }
];

export default function CeremoniesPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Cérémonies</h1>
                    <p className={styles.subtitle}>
                        Pour vos moments les plus précieux
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.container}>
                    <p className={styles.introText}>
                        Chaque cérémonie mérite les meilleurs délices. Chez Mme Daoud, nous
                        préparons des assortiments sur mesure pour rendre vos événements inoubliables.
                    </p>
                </div>
            </section>

            {/* Ceremonies Grid */}
            <section className={styles.ceremoniesSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {ceremonies.map((ceremony) => (
                            <div key={ceremony.id} className={styles.ceremonyCard}>
                                <span className={styles.ceremonyIcon}>{ceremony.icon}</span>
                                <h3 className={styles.ceremonyTitle}>{ceremony.title}</h3>
                                <p className={styles.ceremonyDescription}>{ceremony.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className={styles.services}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Nos Services</h2>
                    <div className={styles.servicesList}>
                        <div className={styles.serviceItem}>
                            <div className={styles.serviceIcon}>✓</div>
                            <span>Coffrets personnalisés selon vos préférences</span>
                        </div>
                        <div className={styles.serviceItem}>
                            <div className={styles.serviceIcon}>✓</div>
                            <span>Emballages élégants avec rubans et décorations</span>
                        </div>
                        <div className={styles.serviceItem}>
                            <div className={styles.serviceIcon}>✓</div>
                            <span>Livraison sur toute la Tunisie</span>
                        </div>
                        <div className={styles.serviceItem}>
                            <div className={styles.serviceIcon}>✓</div>
                            <span>Conseils personnalisés pour le choix des quantités</span>
                        </div>
                        <div className={styles.serviceItem}>
                            <div className={styles.serviceIcon}>✓</div>
                            <span>Devis gratuit sous 24h</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Planifiez votre événement</h2>
                        <p className={styles.ctaText}>
                            Contactez-nous pour obtenir un devis personnalisé adapté à vos besoins.
                        </p>
                        <Link href="/contact?subject=ceremonie" className={styles.ctaButton}>
                            Demander un devis
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
