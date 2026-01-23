import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const giftBoxes = [
    {
        id: '1',
        name: 'Coffret Prestige',
        description: 'Notre sélection premium de pâtisseries dans un écrin raffiné',
        price: 85,
        weight: '500g',
    },
    {
        id: '2',
        name: 'Coffret Tradition',
        description: 'Un assortiment de nos classiques intemporels',
        price: 65,
        weight: '400g',
    },
    {
        id: '3',
        name: 'Coffret Découverte',
        description: 'Parfait pour découvrir nos spécialités',
        price: 45,
        weight: '300g',
    },
    {
        id: '4',
        name: 'Plateau Royal',
        description: 'Un plateau généreux pour les grandes occasions',
        price: 120,
        weight: '1kg',
    }
];

export default function IdeesCadeauxPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Idées de Cadeaux</h1>
                    <p className={styles.subtitle}>
                        Offrez le goût de la tradition avec nos coffrets cadeaux
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className={styles.intro}>
                <div className={styles.container}>
                    <p className={styles.introText}>
                        Que ce soit pour un anniversaire, une fête ou simplement pour faire plaisir,
                        nos coffrets cadeaux sont préparés avec le plus grand soin. Chaque création
                        est un voyage au cœur des saveurs authentiques de la pâtisserie tunisienne.
                    </p>
                </div>
            </section>

            {/* Gift Boxes Grid */}
            <section className={styles.giftsSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {giftBoxes.map((box) => (
                            <div key={box.id} className={styles.giftCard}>
                                <div className={styles.giftImage}>
                                    <div
                                        className={styles.placeholderImage}
                                        style={{
                                            background: `linear-gradient(135deg, hsl(${30 + parseInt(box.id) * 15}, 30%, 80%) 0%, hsl(${35 + parseInt(box.id) * 15}, 25%, 70%) 100%)`
                                        }}
                                    >
                                        <span className={styles.giftIcon}>🎁</span>
                                    </div>
                                </div>
                                <div className={styles.giftContent}>
                                    <h3 className={styles.giftName}>{box.name}</h3>
                                    <p className={styles.giftDescription}>{box.description}</p>
                                    <div className={styles.giftDetails}>
                                        <span className={styles.giftWeight}>{box.weight}</span>
                                        <span className={styles.giftPrice}>{box.price} DT</span>
                                    </div>
                                    <Link href="/contact?subject=commande" className={styles.giftButton}>
                                        Commander
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom Order CTA */}
            <section className={styles.customOrder}>
                <div className={styles.container}>
                    <div className={styles.customContent}>
                        <h2 className={styles.customTitle}>Coffret Personnalisé</h2>
                        <p className={styles.customText}>
                            Vous souhaitez créer un coffret sur mesure avec vos produits préférés ?
                            Contactez-nous pour une commande personnalisée.
                        </p>
                        <Link href="/contact" className={styles.customButton}>
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
