import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './GiftSection.module.css';

const giftCategories = [
    {
        id: 1,
        title: 'Coffrets Prestige',
        description: 'Nos plus belles créations dans des écrins raffinés',
        link: '/idees-cadeaux?category=prestige',
        gradient: 'linear-gradient(135deg, #C9A98D 0%, #B68D51 100%)',
        image: '/images/gifts/coffret-prestige.jpg'
    },
    {
        id: 2,
        title: 'Coffrets Cérémonies',
        description: 'Pour vos mariages, fiançailles et grandes occasions',
        link: '/ceremonies',
        gradient: 'linear-gradient(135deg, #A08B7A 0%, #8B7355 100%)',
        image: '/images/gifts/coffret-ceremonies.jpg'
    },
    {
        id: 3,
        title: 'Plateaux Assortis',
        description: 'Une sélection variée de nos spécialités',
        link: '/idees-cadeaux?category=plateaux',
        gradient: 'linear-gradient(135deg, #D4B896 0%, #C9A98D 100%)',
        image: '/images/gifts/plateau-assorti.jpg'
    }
];

export default function GiftSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <span className={styles.titleSmall}>Idées de</span>
                        <span className={styles.titleLarge}>Cadeaux</span>
                    </h2>
                    <p className={styles.description}>
                        Offrez le goût de la tradition avec nos coffrets cadeaux soigneusement préparés
                    </p>
                </div>

                <div className={styles.grid}>
                    {giftCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.link}
                            className={styles.card}
                        >
                            <div
                                className={styles.cardBackground}
                                style={{ background: category.gradient }}
                            />
                            <div className={styles.cardImage}>
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{category.title}</h3>
                                <p className={styles.cardDescription}>{category.description}</p>
                                <span className={styles.cardLink}>
                                    Découvrir
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.promo}>
                    <div className={styles.promoContent}>
                        <span className={styles.promoLabel}>Offre spéciale</span>
                        <h3 className={styles.promoTitle}>
                            Profitez de <span>-10%</span> sur votre première commande
                        </h3>
                        <p className={styles.promoText}>
                            Utilisez le code BIENVENUE10 lors de votre commande
                        </p>
                        <Link href="/collection" className={styles.promoButton}>
                            Commander maintenant
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
