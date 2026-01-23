"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { NewsArticle } from '@/lib/types/news';

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Partial<NewsArticle> | null>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/news');
            const data = await response.json();
            if (data.success) {
                // By default the API might filter only active, but here we want all for admin
                // Let's assume we'll have a special admin API or the same one updated
                setNews(data.data);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

        try {
            const response = await fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                setNews(news.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const articleToSave = currentArticle;

        try {
            const method = articleToSave?.id ? 'PUT' : 'POST';
            const response = await fetch('/api/admin/news', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleToSave)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchNews();
            }
        } catch (error) {
            console.error('Error saving news:', error);
        }
    };

    if (isLoading) return <div>Chargement...</div>;

    return (
        <div className={styles.page}>
            <div className={styles.headerActions}>
                <button
                    className={styles.addButton}
                    onClick={() => {
                        setCurrentArticle({ title: '', excerpt: '', content: '', image: '', category: 'Événement', tags: [] });
                        setIsModalOpen(true);
                    }}
                >
                    + Ajouter une Actualité
                </button>
            </div>

            <div className={styles.grid}>
                {news.map((item) => (
                    <div key={item.id} className={styles.newsCard}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={item.image || '/images/placeholder.jpg'}
                                alt={item.title}
                                fill
                                className={styles.cardImages}
                            />
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.cardTop}>
                                <span className={styles.category}>{item.category}</span>
                                <span className={`${styles.status} ${item.isActive ? styles.statusActive : styles.statusInactive}`}>
                                    {item.isActive ? 'Actif' : 'Masqué'}
                                </span>
                            </div>
                            <h3 className={styles.newsTitle}>{item.title}</h3>
                            <p className={styles.excerpt}>{item.excerpt}</p>
                        </div>
                        <div className={styles.cardFooter}>
                            <div className={styles.date}>
                                {new Date(item.date).toLocaleDateString('fr-FR')}
                            </div>
                            <div className={styles.actions}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => {
                                        setCurrentArticle(item);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Modifier
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {currentArticle?.id ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Titre</label>
                                <input
                                    className={styles.input}
                                    value={currentArticle?.title || ''}
                                    onChange={e => setCurrentArticle({ ...currentArticle!, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Slug (URL)</label>
                                <input
                                    className={styles.input}
                                    value={currentArticle?.slug || ''}
                                    onChange={e => setCurrentArticle({ ...currentArticle!, slug: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Catégorie</label>
                                <select
                                    className={styles.select}
                                    value={currentArticle?.category || ''}
                                    onChange={e => setCurrentArticle({ ...currentArticle!, category: e.target.value })}
                                >
                                    <option value="Actualité">Actualité</option>
                                    <option value="Événement">Événement</option>
                                    <option value="Collections">Collections</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Extrait (Court résumé)</label>
                                <textarea
                                    className={styles.textarea}
                                    value={currentArticle?.excerpt || ''}
                                    onChange={e => setCurrentArticle({ ...currentArticle!, excerpt: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Contenu complet</label>
                                <textarea
                                    className={styles.textarea}
                                    style={{ height: '200px' }}
                                    value={currentArticle?.content || ''}
                                    onChange={e => setCurrentArticle({ ...currentArticle!, content: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>URL Image</label>
                                <input
                                    className={styles.input}
                                    value={currentArticle?.image || ''}
                                    onChange={e => setCurrentArticle({ ...currentArticle!, image: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Auteur</label>
                                <input
                                    className={styles.input}
                                    value={currentArticle?.author || ''}
                                    onChange={e => setCurrentArticle({ ...currentArticle!, author: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={currentArticle?.isActive ?? true}
                                        onChange={e => setCurrentArticle({ ...currentArticle!, isActive: e.target.checked })}
                                    />
                                    Article Actif (visible sur le site)
                                </label>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Annuler</button>
                                <button type="submit" className={styles.saveButton}>Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
