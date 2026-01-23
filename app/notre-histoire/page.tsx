import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const timelineEvents = [
    {
        year: '1996',
        title: 'La Création',
        description: 'Création par la fondatrice du premier noyau de fabrication de pâtisseries traditionnelles tunisiennes.'
    },
    {
        year: '2000',
        title: 'Expansion Nationale',
        description: 'Au fil des années, les produits de Pâtisserie Mme Daoud ont conquis toute la Tunisie.'
    },
    {
        year: '2005',
        title: 'Reconnaissance',
        description: 'Mme Daoud devient une référence de qualité dans l\'art de la pâtisserie tunisienne.'
    },
    {
        year: '2010',
        title: 'Modernisation',
        description: 'Investissement dans des équipements modernes tout en préservant les méthodes artisanales.'
    },
    {
        year: '2015',
        title: 'Expansion Internationale',
        description: 'Les délices de Mme Daoud sont maintenant dégustés en Europe et au Moyen-Orient.'
    },
    {
        year: '2020',
        title: 'Ère Digitale',
        description: 'Lancement de la vente en ligne pour répondre aux nouvelles exigences clients.'
    },
    {
        year: '2024',
        title: 'Nouveaux Horizons',
        description: 'Ouverture de nouveaux points de vente et développement de la franchise.'
    }
];

export default function NotreHistoirePage() {
    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Notre Histoire</h1>
                    <p className={styles.subtitle}>
                        Un savoir-faire ancestral transmis de génération en génération
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.container}>
                    <div className={styles.introContent}>
                        <p className={styles.introText}>
                            Née de la volonté d&apos;une femme passionnée, Pâtisserie Mme Daoud est présente
                            sur le marché tunisien depuis <strong>1996</strong>. Ce qui a commencé comme un
                            humble atelier familial est aujourd&apos;hui devenu une référence nationale dans
                            l&apos;art de la pâtisserie traditionnelle.
                        </p>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className={styles.timelineSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Notre Parcours</h2>
                    <div className={styles.timeline}>
                        {timelineEvents.map((event, index) => (
                            <div
                                key={event.year}
                                className={`${styles.timelineItem} ${index % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}
                            >
                                <div className={styles.timelineContent}>
                                    <span className={styles.timelineYear}>{event.year}</span>
                                    <h3 className={styles.timelineTitle}>{event.title}</h3>
                                    <p className={styles.timelineDescription}>{event.description}</p>
                                </div>
                            </div>
                        ))}
                        <div className={styles.timelineLine} />
                    </div>
                </div>
            </section>

            {/* Heritage */}
            <section className={styles.heritage}>
                <div className={styles.container}>
                    <div className={styles.heritageGrid}>
                        <div className={styles.heritageImage}>
                            <div className={styles.heritagePattern}>
                                <span>🌿</span>
                            </div>
                        </div>
                        <div className={styles.heritageContent}>
                            <h2 className={styles.heritageTitle}>Un Savoir-Faire Ancestral</h2>
                            <div className={styles.divider} />
                            <p className={styles.heritageText}>
                                La fondatrice a mis en valeur les apprentissages en pâtisseries qu&apos;on lui
                                a inculqués et que toute fille de bonne famille doit acquérir.
                            </p>
                            <p className={styles.heritageText}>
                                Armée de ce capital de savoir-faire, elle le fructifie en créant dès 1996
                                la première unité artisanale de fabrication de pâtisseries tunisiennes.
                            </p>
                            <p className={styles.heritageText}>
                                Elle est l&apos;une des pionnières qui a fait que la fabrication de la pâtisserie
                                tunisienne devienne une activité économique féminine à part entière, conférant
                                ainsi à sa région une référence culturelle culinaire.
                            </p>
                            <p className={styles.heritageText}>
                                Comme en Tunisie la femme est dépositaire de la tradition, ce savoir-faire
                                ancestral est transmis aux générations suivantes. Un personnage essentiel par
                                son sens de l&apos;organisation, de la gestion et héritant l&apos;esprit entrepreneurial
                                maternel, perpétue aujourd&apos;hui l&apos;entreprise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className={styles.values}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Nos Valeurs</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3 className={styles.valueTitle}>Qualité</h3>
                            <p className={styles.valueDescription}>
                                Des ingrédients de première qualité, sélectionnés avec le plus grand soin
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <h3 className={styles.valueTitle}>Tradition</h3>
                            <p className={styles.valueDescription}>
                                Des recettes ancestrales transmises et préservées avec passion
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </div>
                            <h3 className={styles.valueTitle}>Passion</h3>
                            <p className={styles.valueDescription}>
                                Chaque pâtisserie est préparée avec amour et dévouement
                            </p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h3 className={styles.valueTitle}>Famille</h3>
                            <p className={styles.valueDescription}>
                                Une entreprise familiale au service de toutes les familles
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <h2 className={styles.ctaTitle}>Découvrez nos créations</h2>
                    <p className={styles.ctaText}>
                        Laissez-vous tenter par nos délices traditionnels
                    </p>
                    <Link href="/collection" className={styles.ctaButton}>
                        Voir la collection
                    </Link>
                </div>
            </section>
        </div>
    );
}
