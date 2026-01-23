'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { flattenCategoryTree, FlattenedCategory, buildCategoryTree, Category } from '@/lib/utils/categoryUtils';
import CategoryTreeSelect from '@/components/admin/CategoryTreeSelect';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        order: 0,
        parentId: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories');
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingId(category.id);
            setFormData({
                name: category.name,
                slug: category.slug,
                order: category.order,
                parentId: category.parentId || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                slug: '',
                order: 0,
                parentId: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const url = editingId
                ? `/api/admin/categories/${editingId}`
                : '/api/admin/categories';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await fetchCategories();
                setIsModalOpen(false);
            } else {
                alert('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur de connexion');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await fetchCategories();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur de connexion');
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerActions}>
                <h1 className={styles.pageTitle}>Gestion des Catégories</h1>
                <button
                    className={styles.primaryButton}
                    onClick={() => handleOpenModal()}
                >
                    + Nouvelle Catégorie
                </button>
            </div>

            <div className={styles.info}>
                <p>
                    Les catégories sont gérées dynamiquement. Utilisez le bouton ci-dessus pour en ajouter.
                </p>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Chargement...</div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Ordre</span>
                        <span>Nom de la Catégorie</span>
                        <span>Slug Technique</span>
                        <span style={{ textAlign: 'right' }}>Actions</span>
                    </div>
                    {flattenCategoryTree(categories).map((category) => (
                        <div key={category.id} className={styles.tableRow}>
                            <span className={styles.order}>{category.order}</span>
                            <div className={styles.rowWrapper}>
                                <div className={styles.levelIndent}>
                                    {[...Array(category.level)].map((_, i) => (
                                        <div key={i} className={styles.indentBlock}>
                                            <div className={styles.connectedLine}></div>
                                        </div>
                                    ))}
                                    {category.level > 0 && (
                                        <div className={styles.indentBlock}>
                                            <div className={styles.leafLine}></div>
                                        </div>
                                    )}
                                </div>
                                <span className={styles.name}>
                                    <span className={styles.itemIcon}>
                                        {category.level === 0 ? '📁' : '🏷️'}
                                    </span>
                                    {category.name}
                                </span>
                            </div>
                            <span className={styles.slug}>{category.slug}</span>
                            <div className={styles.actions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleOpenModal(category)}
                                    title="Modifier"
                                >
                                    ✏️
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(category.id)}
                                    title="Supprimer"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{editingId ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsModalOpen(false)}
                            >✕</button>
                        </div>
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            name,
                                            slug: !editingId ? generateSlug(name) : prev.slug
                                        }));
                                    }}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Parent</label>
                                <CategoryTreeSelect
                                    categories={categories.filter(c => c.id !== editingId)} // Prevent self-parenting
                                    value={categories.find(c => c.id === formData.parentId)?.slug || ''} // Use slug for display finding but we need ID for storage logic... wait CategoryTreeSelect uses slug. 
                                    // Actually CategoryTreeSelect returns Slug. Our formData stores parentId (ID).
                                    // This is a mismatch. Let's adjust logic.
                                    // If CategoryTreeSelect works with Slugs, we need to map back to ID.
                                    onChange={(slug) => {
                                        const cat = categories.find(c => c.slug === slug);
                                        setFormData(prev => ({ ...prev, parentId: cat ? cat.id : '' }));
                                    }}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ordre</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                                    Annuler
                                </button>
                                <button type="submit" className={styles.saveButton} disabled={isSaving}>
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
