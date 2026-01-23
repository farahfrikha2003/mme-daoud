"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import CategoryTreeSelect from '@/components/admin/CategoryTreeSelect';

interface Category {
    id: string;
    slug: string;
    name: string;
    order: number;
    parentId?: string;
    children?: Category[];
}

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    composition: string;
    conservation: string;
    price: number;
    priceUnit: string;
    categorySlug: string;
    images: string[];
    imageUrl?: string; // Helper for UI
    isNew: boolean;
    isPromo: boolean;
    promoPrice?: number;
    isFeatured: boolean;
    isGlutenFree: boolean;
    isActive: boolean;
    piecesPerHundredGrams: number;
    minQuantity: number;
    stock: 'in_stock' | 'low_stock' | 'out_of_stock';
    stockQuantity?: number;
    recipe?: string;
}

const emptyProduct: Product = {
    id: 'new',
    slug: '',
    name: '',
    description: '',
    composition: '',
    conservation: 'Lieu sec et frais',
    price: 0,
    priceUnit: 'Kg',
    categorySlug: '',
    images: [],
    imageUrl: '',
    isNew: false,
    isPromo: false,
    isFeatured: false,
    isGlutenFree: false,
    isActive: true,
    piecesPerHundredGrams: 50,
    minQuantity: 1,
    stock: 'in_stock',
    recipe: ''
};

export default function ProductEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === 'new';

    const [product, setProduct] = useState<Product>(emptyProduct);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch categories
                const catRes = await fetch('/api/admin/categories');
                const catData = await catRes.json();
                if (catData.success) {
                    setCategories(catData.data);
                }

                // Fetch product if editing
                if (!isNew) {
                    const prodRes = await fetch(`/api/admin/products/${id}`);
                    const prodData = await prodRes.json();
                    if (prodData.success) {
                        const p = prodData.data;
                        setProduct({
                            ...p,
                            imageUrl: p.images && p.images.length > 0 ? p.images[0] : ''
                        });
                    } else {
                        setError('Produit non trouvé');
                    }
                } else if (catData.success && catData.data.length > 0) {
                    // Set default category for new product
                    setProduct(prev => ({ ...prev, categorySlug: catData.data[0].slug }));
                }
            } catch (err) {
                console.error(err);
                setError('Erreur lors du chargement des données');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, isNew]);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setProduct(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            const val = value === '' ? 0 : parseFloat(value);
            setProduct(prev => ({ ...prev, [name]: val }));
        } else {
            setProduct(prev => {
                const updated = { ...prev, [name]: value };
                if (name === 'name' && isNew) {
                    updated.slug = generateSlug(value);
                }
                return updated;
            });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const url = isNew ? '/api/admin/products' : `/api/admin/products/${id}`;
            const method = isNew ? 'POST' : 'PUT';

            // Prepare payload: ensure images array is updated from imageUrl
            const payload = {
                ...product,
                images: product.imageUrl ? [product.imageUrl] : product.images
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                router.push('/admin/products');
                router.refresh();
            } else {
                setError(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur de connexion');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    if (error && !product) {
        return (
            <div className={styles.page}>
                <div className={styles.error}>{error}</div>
                <Link href="/admin/products" className={styles.cancelButton}>
                    Retour
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {isNew ? 'Nouveau Produit' : `Modifier ${product.name}`}
                </h1>
                <div className={styles.actions}>
                    <Link href="/admin/products" className={styles.cancelButton}>
                        Annuler
                    </Link>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.formContainer}>
                <div className={styles.mainColumn}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Informations Générales</h2>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nom du produit</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Ex: Baklawa Amande"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Slug (URL)</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={product.slug}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="baklawa-amande"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                className={styles.textarea}
                                placeholder="Description détaillée du produit..."
                            />
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Composition</label>
                                <textarea
                                    name="composition"
                                    value={product.composition}
                                    onChange={handleChange}
                                    className={styles.textareaSmall}
                                    placeholder="Ingrédients, allergènes..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Conservation</label>
                                <textarea
                                    name="conservation"
                                    value={product.conservation}
                                    onChange={handleChange}
                                    className={styles.textareaSmall}
                                    placeholder="Conditions de stockage..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Recette & Secrets</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Recette associée</label>
                            <textarea
                                name="recipe"
                                value={product.recipe || ''}
                                onChange={handleChange}
                                className={styles.textareaLarge}
                                placeholder="Détaillez la recette ici (ingrédients, étapes)..."
                            />
                            <p className={styles.fieldHint}>
                                Cette recette sera associée au produit pour usage interne ou affichage futur.
                            </p>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Prix et Catégorie</h2>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Prix de base</label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        className={styles.input}
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className={styles.unit}>TND</span>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Unité de prix</label>
                                <select
                                    name="priceUnit"
                                    value={product.priceUnit}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="Kg">Par Kg</option>
                                    <option value="100g">Par 100g</option>
                                    <option value="Piece">À la pièce</option>
                                    <option value="Box">La boîte</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Catégorie</label>
                                <CategoryTreeSelect
                                    categories={categories}
                                    value={product.categorySlug}
                                    onChange={(slug) => setProduct(prev => ({ ...prev, categorySlug: slug }))}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Prix Promo (Optionnel)</label>
                                <div className={styles.inputWithUnit}>
                                    <input
                                        type="number"
                                        name="promoPrice"
                                        value={product.promoPrice || ''}
                                        onChange={handleChange}
                                        className={styles.input}
                                        min="0"
                                        step="0.01"
                                        disabled={!product.isPromo}
                                    />
                                    <span className={styles.unit}>TND</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Spécifications Techniques</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Pièces / 100g</label>
                                <input
                                    type="number"
                                    name="piecesPerHundredGrams"
                                    value={product.piecesPerHundredGrams}
                                    onChange={handleChange}
                                    className={styles.input}
                                    min="1"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Quantité Min. (Grams/Pcs)</label>
                                <input
                                    type="number"
                                    name="minQuantity"
                                    value={product.minQuantity}
                                    onChange={handleChange}
                                    className={styles.input}
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.sideColumn}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Image du Produit</h2>
                        <div
                            className={styles.imageUpload}
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt="Preview"
                                    fill
                                    className={styles.previewImage}
                                />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <span style={{ fontSize: '2.5rem' }}>📸</span>
                                    <span>Cliquez pour télécharger</span>
                                    <span className={styles.uploadHint}>JPG, PNG ou WebP</span>
                                </div>
                            )}
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const formData = new FormData();
                                        formData.append('file', file);

                                        try {
                                            const res = await fetch('/api/admin/upload', {
                                                method: 'POST',
                                                body: formData
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                                setProduct(prev => ({ ...prev, imageUrl: data.url }));
                                            } else {
                                                alert('Erreur: ' + data.error);
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert('Erreur lors du téléchargement');
                                        }
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <input
                            type="text"
                            name="imageUrl"
                            value={product.imageUrl || ''}
                            onChange={handleChange}
                            className={styles.inputUrl}
                            placeholder="URL de l'image externe..."
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Gestion du Stock</h2>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Statut du stock</label>
                            <select
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="in_stock">En Stock</option>
                                <option value="low_stock">Stock Faible</option>
                                <option value="out_of_stock">Rupture de Stock</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Quantité en stock</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={product.stockQuantity || ''}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Illimité si vide"
                            />
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Paramètres & Visibilité</h2>
                        <div className={styles.toggles}>
                            <label className={styles.toggleItem}>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={product.isActive}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                />
                                <div className={styles.toggleText}>
                                    <span>Actif</span>
                                    <small>Visible dans le catalogue</small>
                                </div>
                            </label>

                            <label className={styles.toggleItem}>
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={product.isFeatured}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                />
                                <div className={styles.toggleText}>
                                    <span>Mise en avant</span>
                                    <small>Afficher sur la page d'accueil</small>
                                </div>
                            </label>

                            <label className={styles.toggleItem}>
                                <input
                                    type="checkbox"
                                    name="isNew"
                                    checked={product.isNew}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                />
                                <div className={styles.toggleText}>
                                    <span>Nouveauté</span>
                                    <small>Afficher le badge "Nouveau"</small>
                                </div>
                            </label>

                            <label className={styles.toggleItem}>
                                <input
                                    type="checkbox"
                                    name="isPromo"
                                    checked={product.isPromo}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                />
                                <div className={styles.toggleText}>
                                    <span>Promotion</span>
                                    <small>Appliquer le prix promo</small>
                                </div>
                            </label>

                            <label className={styles.toggleItem}>
                                <input
                                    type="checkbox"
                                    name="isGlutenFree"
                                    checked={product.isGlutenFree}
                                    onChange={handleChange}
                                    className={styles.checkbox}
                                />
                                <div className={styles.toggleText}>
                                    <span>Sans Gluten</span>
                                    <small>Afficher l'icône sans gluten</small>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
