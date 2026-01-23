import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './WelcomeSection.module.css';

export default function WelcomeSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Left column - Main text */}
                    <div className={styles.mainContent}>
                        <h2 className={styles.title}>
                            <span className={styles.titleSmall}>Bienvenue</span>
                            <span className={styles.titleLarge}>à la maison</span>
                        </h2>
                        <div className={styles.divider} />
                        <p className={styles.text}>
                            Mme Daoud est un label de qualité inscrit dans la tradition qu&apos;elle s&apos;emploie
                            à perpétuer avec une dose appropriée de modernité…
                        </p>
                        <p className={styles.text}>
                            Au fil du temps, Pâtisserie Mme Daoud est devenue une référence reconnue de l&apos;art
                            de la Pâtisserie sur toute la Tunisie et à l&apos;international.
                        </p>
                        <p className={styles.text}>
                            L&apos;amélioration continue et la diversification de ses produits et services qui
                            répondent aux exigences de ses clients et aux normes internationales restent parmi
                            les forces de ventes de pâtisserie Mme Daoud.
                        </p>
                        <Link href="/presentation" className={styles.link}>
                            Lire la suite
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                    </div>

                    {/* Right column - History highlight */}
                    <div className={styles.historyContent}>
                        <div className={styles.historyImageWrapper}>
                            <Image
                                src="/images/hero/hero-3.png"
                                alt="Coffrets Cadeaux"
                                fill
                                className={styles.historyImage}
                            />
                        </div>
                        <div className={styles.historyCard}>
                            <p className={styles.historyText}>
                                La fondatrice, a mis en valeur les apprentissages en pâtisseries qu&apos;on lui
                                a inculquées et que toute fille de bonne famille doit acquérir.
                            </p>
                            <p className={styles.historyText}>
                                Armée de ce capital de savoir-faire, elle le fructifie en créant dès 1996
                                la première unité artisanale de fabrication de pâtisseries tunisienne.
                            </p>
                            <p className={styles.historyText}>
                                Elle est l&apos;une des pionnières qui a fait que la fabrication de la pâtisserie
                                tunisienne devienne une activité économique féminine à part entière.
                            </p>
                            <Link href="/notre-histoire" className={styles.historyLink}>
                                En savoir plus
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats section */}
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>40+</span>
                        <span className={styles.statLabel}>Ans d&apos;expérience</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>100+</span>
                        <span className={styles.statLabel}>Produits artisanaux</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>1996</span>
                        <span className={styles.statLabel}>Depuis</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
