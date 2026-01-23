"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    category: string;
    stock: string;
    isActive: boolean;
    isNew: boolean;
    isPromo: boolean;
    images: string[];
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/admin/products?includeInactive=true');
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) return;

        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch {
            alert('Erreur lors de la suppression');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const stockLabels: Record<string, string> = {
        in_stock: 'En stock',
        low_stock: 'Stock faible',
        out_of_stock: 'Rupture'
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <Link href="/admin/products/new" className={styles.addButton}>
                    + Ajouter un produit
                </Link>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Chargement...</div>
            ) : filteredProducts.length === 0 ? (
                <div className={styles.empty}>
                    <p>Aucun produit trouvé</p>
                    <Link href="/admin/products/new" className={styles.emptyButton}>
                        Créer votre premier produit
                    </Link>
                </div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Produit</span>
                        <span>Catégorie</span>
                        <span>Prix</span>
                        <span>Stock</span>
                        <span>Statut</span>
                        <span>Actions</span>
                    </div>
                    {filteredProducts.map((product) => (
                        <div key={product.id} className={styles.tableRow}>
                            <div className={styles.productInfo}>
                                <div className={styles.productImage}>
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} />
                                    ) : (
                                        <span>🍰</span>
                                    )}
                                </div>
                                <div>
                                    <div className={styles.productName}>{product.name}</div>
                                    <div className={styles.productSlug}>/{product.slug}</div>
                                </div>
                            </div>
                            <span className={styles.category}>{product.category}</span>
                            <span className={styles.price}>{product.price.toFixed(2)} DT</span>
                            <span className={`${styles.stock} ${styles[`stock_${product.stock}`]}`}>
                                {stockLabels[product.stock] || product.stock}
                            </span>
                            <div className={styles.badges}>
                                {!product.isActive && <span className={styles.badgeInactive}>Inactif</span>}
                                {product.isNew && <span className={styles.badgeNew}>Nouveau</span>}
                                {product.isPromo && <span className={styles.badgePromo}>Promo</span>}
                                {product.isActive && !product.isNew && !product.isPromo && (
                                    <span className={styles.badgeActive}>Actif</span>
                                )}
                            </div>
                            <div className={styles.actions}>
                                <Link href={`/admin/products/${product.id}`} className={styles.editButton}>
                                    Modifier
                                </Link>
                                <button
                                    onClick={() => handleDelete(product.id, product.name)}
                                    className={styles.deleteButton}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
