"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { NewsArticle } from '@/lib/types/news';

export default function ActusPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news');
                const data = await response.json();
                if (data.success) {
                    setArticles(data.data);
                } else {
                    setError(data.error || 'Erreur lors du chargement des actualités');
                }
            } catch (err) {
                setError('Erreur de connexion au serveur');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Chargement des actualités...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <h2>Oups !</h2>
                <p>{error}</p>
                <Link href="/" className="btn-primary">Retour à l'accueil</Link>
            </div>
        );
    }

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Actualités</h1>
                <p className={styles.subtitle}>
                    Suivez les coulisses de la maison Mme Daoud : événements, nouvelles créations et héritage.
                </p>
            </section>

            <section className={styles.newsGrid}>
                {articles.map((article) => (
                    <article key={article.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <span className={styles.categoryTag}>{article.category}</span>
                            <Image
                                src={article.image || '/images/placeholder.jpg'}
                                alt={article.title}
                                fill
                                className={styles.cardImage}
                            />
                        </div>
                        <div className={styles.cardBody}>
                            <p className={styles.date}>
                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                            <h2 className={styles.cardTitle}>{article.title}</h2>
                            <p className={styles.excerpt}>{article.excerpt}</p>
                            <Link href={`/actus/${article.slug}`} className={styles.readMore}>
                                Lire la suite
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </article>
                ))}
            </section>

            {articles.length === 0 && (
                <div className={styles.empty}>
                    <p>Aucune actualité pour le moment. Revenez bientôt !</p>
                </div>
            )}
        </main>
    );
}
