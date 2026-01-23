import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './TraditionalSection.module.css';

export default function TraditionalSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Left - Image/Decorative */}
                    <div className={styles.imageColumn}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="/images/hero/hero-1.png"
                                alt="Pâtisseries Traditionnelles"
                                fill
                                className={styles.sectionImage}
                            />
                            <div className={styles.imageDecor} />
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className={styles.contentColumn}>
                        <div className={styles.label}>Nos Délices</div>
                        <h2 className={styles.title}>Traditionnels</h2>
                        <div className={styles.divider} />
                        <p className={styles.text}>
                            Nous vous offrons la meilleure qualité de matières premières grâce à notre
                            tradition et la richesse de ses champs d&apos;amandiers et d&apos;oliviers.
                        </p>
                        <p className={styles.text}>
                            Chaque pâtisserie est préparée avec soin selon des recettes ancestrales,
                            transmises de génération en génération.
                        </p>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <div className={styles.featureIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <div className={styles.featureText}>
                                    <strong>Qualité Premium</strong>
                                    <span>Ingrédients sélectionnés avec soin</span>
                                </div>
                            </div>
                            <div className={styles.feature}>
                                <div className={styles.featureIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <div className={styles.featureText}>
                                    <strong>Tradition</strong>
                                    <span>Recettes ancestrales préservées</span>
                                </div>
                            </div>
                            <div className={styles.feature}>
                                <div className={styles.featureIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </div>
                                <div className={styles.featureText}>
                                    <strong>Fait Maison</strong>
                                    <span>Préparation artisanale quotidienne</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/collection?category=hlou-arbi" className={styles.ctaButton}>
                            Découvrir nos produits
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
