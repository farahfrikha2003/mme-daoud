import React from 'react';
import styles from './page.module.css';

export default function InformationsLegalesPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Informations Légales</h1>
                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>Éditeur du site</h2>
                        <p>
                            <strong>Pâtisserie Mme Daoud</strong>
                            <br />
                            Depuis 1996
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Directeur de publication</h2>
                        <p>
                            Mme Daoud
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Hébergement</h2>
                        <p>
                            Ce site est hébergé par Vercel Inc.
                            <br />
                            Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Propriété intellectuelle</h2>
                        <p>
                            L'ensemble de ce site relève de la législation tunisienne et internationale
                            sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction
                            sont réservés, y compris pour les documents téléchargeables et les représentations
                            iconographiques et photographiques.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Protection des données personnelles</h2>
                        <p>
                            Conformément à la loi tunisienne sur la protection des données personnelles,
                            vous disposez d'un droit d'accès, de rectification et de suppression des données
                            vous concernant. Pour exercer ce droit, veuillez nous contacter via notre page de contact.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Cookies</h2>
                        <p>
                            Ce site utilise des cookies pour améliorer l'expérience utilisateur.
                            En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Contact</h2>
                        <p>
                            Pour toute question concernant ces informations légales, veuillez nous contacter
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
