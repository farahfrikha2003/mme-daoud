"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { NewsArticle } from '@/lib/types/news';

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/news/${params.slug}`);
                const data = await response.json();
                if (data.success) {
                    setArticle(data.data);
                } else {
                    setError(data.error || 'Article non trouvé');
                }
            } catch (err) {
                setError('Erreur lors de la récupération de l\'article');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Chargement de l'article...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className={styles.error}>
                <h2>Désolé</h2>
                <p>{error || 'Cet article n\'existe pas'}</p>
                <Link href="/actus" className="btn-primary">Retour aux actualités</Link>
            </div>
        );
    }

    return (
        <main className={styles.page}>
            <article className={styles.container}>
                <Link href="/actus" className={styles.backLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Retour aux actualités
                </Link>

                <header className={styles.header}>
                    <span className={styles.category}>{article.category}</span>
                    <h1 className={styles.title}>{article.title}</h1>
                    <div className={styles.meta}>
                        <span>Par {article.author}</span>
                        <span>•</span>
                        <span>
                            {new Date(article.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </header>

                <div className={styles.imageWrapper}>
                    <Image
                        src={article.image || '/images/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className={styles.image}
                        priority
                    />
                </div>

                <div className={styles.content}>
                    {article.content.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>

                {article.tags && article.tags.length > 0 && (
                    <div className={styles.tags}>
                        {article.tags.map(tag => (
                            <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                )}
            </article>
        </main>
    );
}
