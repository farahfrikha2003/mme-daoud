import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

const quickLinks = [
    { name: 'Collection', href: '/collection' },
    { name: 'Cérémonies', href: '/ceremonies' },
    { name: 'Idées de Cadeaux', href: '/idees-cadeaux' },
    { name: 'Histoire', href: '/notre-histoire' },
    { name: 'Devenez Franchisé', href: '/devenez-franchise' },
    { name: 'Contact', href: '/contact' },
];

const legalLinks = [
    { name: 'Termes et conditions', href: '/termes-conditions' },
    { name: 'Politique de confidentialité', href: '/politique-confidentialite' },
    { name: 'Informations légales', href: '/informations-legales' },
];

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://facebook.com',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        )
    },
    {
        name: 'Instagram',
        href: 'https://instagram.com',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        )
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        )
    },
    {
        name: 'YouTube',
        href: 'https://youtube.com',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
            </svg>
        )
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            {/* Section principale */}
            <div className={styles.mainSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {/* Colonne Logo & Description */}
                        <div className={styles.brandColumn}>
                            <Link href="/" className={styles.logo}>
                                <Image
                                    src="/logo.png"
                                    alt="Pâtisserie Mme Daoud"
                                    width={150}
                                    height={100}
                                />
                            </Link>
                            <p className={styles.description}>
                                Mme Daoud est un label de qualité inscrit dans la tradition de la pâtisserie
                                tunisienne qu&apos;elle s&apos;emploie à perpétuer avec une dose appropriée de modernité.
                            </p>
                            <div className={styles.socialLinks}>
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialLink}
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Colonne Liens utiles */}
                        <div className={styles.linksColumn}>
                            <h3 className={styles.columnTitle}>Liens utiles</h3>
                            <ul className={styles.linksList}>
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className={styles.link}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Colonne Contact */}
                        <div className={styles.contactColumn}>
                            <h3 className={styles.columnTitle}>Contact</h3>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>Tunisie</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <a href="tel:+21600000000">+216 00 000 000</a>
                                </div>
                                <div className={styles.contactItem}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <a href="mailto:contact@mme-daoud.tn">contact@mme-daoud.tn</a>
                                </div>
                            </div>
                        </div>

                        {/* Colonne Newsletter */}
                        <div className={styles.newsletterColumn}>
                            <h3 className={styles.columnTitle}>Newsletter</h3>
                            <p className={styles.newsletterText}>
                                Inscrivez-vous pour recevoir nos offres et nouveautés
                            </p>
                            <form className={styles.newsletterForm}>
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    className={styles.newsletterInput}
                                />
                                <button type="submit" className={styles.newsletterButton}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barre copyright */}
            <div className={styles.copyrightBar}>
                <div className={styles.container}>
                    <div className={styles.copyrightContent}>
                        <p className={styles.copyright}>
                            © {currentYear} Pâtisserie Mme Daoud - Depuis 1996
                        </p>
                        <div className={styles.legalLinks}>
                            {legalLinks.map((link) => (
                                <Link key={link.name} href={link.href} className={styles.legalLink}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
