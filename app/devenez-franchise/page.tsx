import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function DevenezFranchisePage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Devenez Franchisé</h1>
                    <p className={styles.subtitle}>
                        Rejoignez la famille Mme Daoud
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.container}>
                    <div className={styles.introContent}>
                        <p className={styles.introText}>
                            Vous souhaitez entreprendre dans le secteur de la pâtisserie traditionnelle
                            tunisienne ? Rejoignez le réseau Mme Daoud et bénéficiez de notre expertise,
                            de notre notoriété et de notre savoir-faire reconnu depuis plus de 25 ans.
                        </p>
                    </div>
                </div>
            </section>

            {/* Advantages */}
            <section className={styles.advantages}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Nos Avantages</h2>
                    <div className={styles.advantagesGrid}>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>🏆</div>
                            <h3 className={styles.advantageTitle}>Marque Reconnue</h3>
                            <p className={styles.advantageText}>
                                Bénéficiez de la notoriété d&apos;une marque établie et appréciée depuis 1996.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>📚</div>
                            <h3 className={styles.advantageTitle}>Formation Complète</h3>
                            <p className={styles.advantageText}>
                                Formation initiale et continue sur nos recettes, techniques et gestion.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>🤝</div>
                            <h3 className={styles.advantageTitle}>Accompagnement</h3>
                            <p className={styles.advantageText}>
                                Support continu de notre équipe à chaque étape de votre activité.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>📍</div>
                            <h3 className={styles.advantageTitle}>Exclusivité Territoriale</h3>
                            <p className={styles.advantageText}>
                                Zone géographique exclusive pour développer votre clientèle.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className={styles.process}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Comment Devenir Franchisé ?</h2>
                    <div className={styles.processSteps}>
                        <div className={styles.processStep}>
                            <div className={styles.stepNumber}>1</div>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>Candidature</h3>
                                <p className={styles.stepText}>Remplissez le formulaire de candidature</p>
                            </div>
                        </div>
                        <div className={styles.processStep}>
                            <div className={styles.stepNumber}>2</div>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>Entretien</h3>
                                <p className={styles.stepText}>Rencontre avec notre équipe de développement</p>
                            </div>
                        </div>
                        <div className={styles.processStep}>
                            <div className={styles.stepNumber}>3</div>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>Formation</h3>
                                <p className={styles.stepText}>Formation complète dans notre centre</p>
                            </div>
                        </div>
                        <div className={styles.processStep}>
                            <div className={styles.stepNumber}>4</div>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>Ouverture</h3>
                                <p className={styles.stepText}>Lancement de votre boutique avec notre soutien</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Intéressé(e) ?</h2>
                        <p className={styles.ctaText}>
                            Contactez-nous pour en savoir plus sur les opportunités de franchise.
                        </p>
                        <Link href="/contact?subject=franchise" className={styles.ctaButton}>
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
