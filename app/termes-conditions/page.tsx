import React from 'react';
import styles from './page.module.css';

export default function TermesConditionsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Termes et Conditions</h1>
                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. Acceptation des conditions</h2>
                        <p>
                            En accédant et en utilisant ce site web, vous acceptez d'être lié par les présents termes et conditions.
                            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Utilisation du site</h2>
                        <p>
                            Ce site est destiné à fournir des informations sur nos produits et services.
                            Vous vous engagez à utiliser ce site de manière légale et conforme à ces termes.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Commandes et paiements</h2>
                        <p>
                            Toutes les commandes sont soumises à acceptation de notre part. Nous nous réservons le droit
                            de refuser ou d'annuler toute commande à tout moment.
                        </p>
                        <p>
                            Les prix sont indiqués en dinars tunisiens (DT) et peuvent être modifiés sans préavis.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Propriété intellectuelle</h2>
                        <p>
                            Tous les contenus de ce site, y compris les textes, images, logos et designs, sont la propriété
                            de Pâtisserie Mme Daoud et sont protégés par les lois sur la propriété intellectuelle.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Limitation de responsabilité</h2>
                        <p>
                            Pâtisserie Mme Daoud ne pourra être tenue responsable des dommages directs ou indirects
                            résultant de l'utilisation de ce site.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Modifications</h2>
                        <p>
                            Nous nous réservons le droit de modifier ces termes et conditions à tout moment.
                            Les modifications prendront effet dès leur publication sur ce site.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Contact</h2>
                        <p>
                            Pour toute question concernant ces termes et conditions, veuillez nous contacter
                            via notre page de contact.
                        </p>
                    </section>

                    <p className={styles.lastUpdated}>
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
