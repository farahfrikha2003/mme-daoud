import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function PresentationPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Présentation</h1>
                    <p className={styles.subtitle}>Découvrez qui nous sommes</p>
                </div>
            </section>

            {/* Mission */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <h2 className={styles.sectionTitle}>Notre Mission</h2>
                        <div className={styles.divider} />
                        <p className={styles.text}>
                            Mme Daoud tient à être un label de qualité inscrit dans la tradition
                            qu&apos;elle s&apos;emploie à perpétuer avec une dose appropriée de modernité
                            qui la concilie avec les goûts et les exigences d&apos;aujourd&apos;hui.
                        </p>
                        <p className={styles.text}>
                            Notre mission est de préserver et de transmettre l&apos;art culinaire
                            tunisien à travers des pâtisseries d&apos;exception, préparées selon des
                            recettes ancestrales avec les meilleurs ingrédients.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className={styles.valuesSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Nos Valeurs</h2>
                    <p className={styles.subtitle2}>Des valeurs fortes pour des produits de qualité !</p>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <h3 className={styles.valueTitle}>Authenticité</h3>
                            <p className={styles.valueText}>
                                Nous restons fidèles aux recettes traditionnelles tout en les adaptant
                                aux goûts contemporains.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <h3 className={styles.valueTitle}>Excellence</h3>
                            <p className={styles.valueText}>
                                La recherche de la perfection guide chacune de nos créations.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <h3 className={styles.valueTitle}>Savoir-Faire</h3>
                            <p className={styles.valueText}>
                                Un savoir-faire artisanal transmis de génération en génération.
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <h3 className={styles.valueTitle}>Engagement</h3>
                            <p className={styles.valueText}>
                                Nous nous engageons pour la satisfaction de nos clients et la qualité
                                de nos produits.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quality */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <h2 className={styles.sectionTitle}>Notre Engagement Qualité</h2>
                        <div className={styles.divider} />
                        <p className={styles.text}>
                            Chez Mme Daoud, la qualité n&apos;est pas un objectif, c&apos;est une philosophie.
                            Nous sélectionnons avec le plus grand soin nos matières premières : amandes
                            de première qualité, miel naturel, huile d&apos;olive extra vierge.
                        </p>
                        <p className={styles.text}>
                            Chaque pâtisserie est préparée à la main selon des techniques traditionnelles,
                            garantissant une texture et un goût inégalés. Nous n&apos;utilisons aucun
                            conservateur ni colorant artificiel.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <h2 className={styles.ctaTitle}>Découvrez Notre Histoire</h2>
                    <p className={styles.ctaText}>
                        Plongez dans l&apos;histoire de la famille Daoud et de sa passion pour
                        la pâtisserie tunisienne.
                    </p>
                    <Link href="/notre-histoire" className={styles.ctaButton}>
                        Notre Histoire
                    </Link>
                </div>
            </section>
        </div>
    );
}
