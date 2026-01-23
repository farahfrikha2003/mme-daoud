import React from 'react';
import styles from './page.module.css';

export default function PolitiqueConfidentialitePage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Politique de Confidentialité</h1>
                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. Collecte des données</h2>
                        <p>
                            Nous collectons les informations que vous nous fournissez directement lorsque vous :
                        </p>
                        <ul>
                            <li>Créez un compte sur notre site</li>
                            <li>Passez une commande</li>
                            <li>Nous contactez via le formulaire de contact</li>
                            <li>Vous abonnez à notre newsletter</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Utilisation des données</h2>
                        <p>
                            Les données collectées sont utilisées pour :
                        </p>
                        <ul>
                            <li>Traiter et gérer vos commandes</li>
                            <li>Améliorer nos services et votre expérience</li>
                            <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                            <li>Répondre à vos demandes et questions</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Protection des données</h2>
                        <p>
                            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données
                            personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Partage des données</h2>
                        <p>
                            Nous ne vendons, n'échangeons ni ne louons vos données personnelles à des tiers.
                            Nous pouvons partager vos informations uniquement dans les cas suivants :
                        </p>
                        <ul>
                            <li>Avec votre consentement explicite</li>
                            <li>Pour respecter une obligation légale</li>
                            <li>Avec nos prestataires de services de confiance (sous contrat de confidentialité)</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Vos droits</h2>
                        <p>
                            Conformément à la législation en vigueur, vous disposez des droits suivants :
                        </p>
                        <ul>
                            <li>Droit d'accès à vos données personnelles</li>
                            <li>Droit de rectification de vos données</li>
                            <li>Droit à l'effacement de vos données</li>
                            <li>Droit d'opposition au traitement de vos données</li>
                            <li>Droit à la portabilité de vos données</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Cookies</h2>
                        <p>
                            Notre site utilise des cookies pour améliorer votre expérience de navigation.
                            Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut
                            affecter certaines fonctionnalités du site.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Contact</h2>
                        <p>
                            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
                            veuillez nous contacter via notre page de contact.
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
