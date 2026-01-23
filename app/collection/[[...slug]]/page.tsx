"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Product, Category } from '@/lib/types/product';
import styles from './page.module.css';
import CategorySidebar from './CategorySidebar';
import { useParams, useRouter } from 'next/navigation';

interface CategoryNode extends Category {
    children: CategoryNode[];
}

export default function CollectionPage() {
    const params = useParams();
    const router = useRouter();
    const slugParts = params.slug as string[] | undefined;
    const currentSlug = slugParts && slugParts.length > 0 ? slugParts[slugParts.length - 1] : undefined;

    const [products, setProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
    const [isGlutenFree, setIsGlutenFree] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, prodsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/products')
                ]);

                const catsData = await catsRes.json();
                const tree = buildCategoryTree(catsData);
                setCategoryTree(tree);

                // Initialize selected categories from URL if present
                if (currentSlug && currentSlug !== 'all') {
                    setSelectedCategorySlugs([currentSlug]);
                }

                let productsData: Product[] = [];
                if (prodsRes.ok) {
                    const json = await prodsRes.json();
                    productsData = json.data || [];
                }
                setAllProducts(productsData);

            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchData();
    }, []);

    // Helper to build tree
    const buildCategoryTree = (categories: Category[]): CategoryNode[] => {
        const map = new Map<string, CategoryNode>();
        const roots: CategoryNode[] = [];

        // First pass: create nodes
        categories.forEach(cat => {
            map.set(cat.id, { ...cat, children: [] });
        });

        // Second pass: link parents
        categories.forEach(cat => {
            const node = map.get(cat.id)!;
            if (cat.parentId && map.has(cat.parentId)) {
                map.get(cat.parentId)!.children.push(node);
            } else {
                roots.push(node);
            }
        });

        // Add "All Products" virtual category at top if desired, or handle via route
        // roots.unshift({ id: '0', slug: 'all', name: 'Tous les produits', description: '', image: '', order: 0, children: [] } as CategoryNode);

        return roots.sort((a, b) => a.order - b.order);
    };

    // Filter Logic
    useEffect(() => {
        let filtered = [...allProducts];

        // 1. Category Filter (Multi-select)
        if (selectedCategorySlugs.length > 0) {
            const slugsToInclude = new Set<string>();

            const findNodeBySlug = (nodes: CategoryNode[], slug: string): CategoryNode | null => {
                for (const node of nodes) {
                    if (node.slug === slug) return node;
                    const found = findNodeBySlug(node.children, slug);
                    if (found) return found;
                }
                return null;
            };

            const addSlugsRecursive = (node: CategoryNode) => {
                slugsToInclude.add(node.slug);
                node.children.forEach(addSlugsRecursive);
            };

            selectedCategorySlugs.forEach(slug => {
                const node = findNodeBySlug(categoryTree, slug);
                if (node) {
                    addSlugsRecursive(node);
                }
            });

            filtered = filtered.filter(p => slugsToInclude.has(p.categorySlug));
        }

        // 2. Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // 3. Price
        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // 4. Gluten Free
        if (isGlutenFree) {
            filtered = filtered.filter(p => p.isGlutenFree);
        }

        // 5. Sort
        switch (sortBy) {
            case 'price_asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            default:
                filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setProducts(filtered);
    }, [allProducts, categoryTree, selectedCategorySlugs, searchQuery, priceRange, isGlutenFree, sortBy]);

    const handleToggleCategory = (slug: string) => {
        setSelectedCategorySlugs(prev =>
            prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        );
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Collection</h1>
                    <p className={styles.subtitle}>Découvrez toute notre gamme de pâtisseries traditionnelles</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.container}>
                    {/* Mobile Filters Toggle */}
                    <button
                        className={styles.mobileFiltersToggle}
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    >
                        <span>Filtres & Catégories</span>
                    </button>

                    <div className={styles.layout}>
                        {/* Sidebar Filters */}
                        <aside className={`${styles.sidebar} ${isMobileFiltersOpen ? styles.sidebarOpen : ''}`}>
                            <div className={styles.sidebarHeader}>
                                <h3 className={styles.sidebarTitle}>Filtres</h3>
                                <button
                                    className={styles.closeSidebar}
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Categories Tree */}
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Catégories</h3>
                                {isLoadingCategories ? (
                                    <div className={styles.loadingCategories}>Chargement...</div>
                                ) : (
                                    <CategorySidebar
                                        categories={categoryTree}
                                        selectedSlugs={selectedCategorySlugs}
                                        onToggle={handleToggleCategory}
                                    />
                                )}
                            </div>

                            {/* Search */}
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Rechercher</h3>
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>

                            {/* Price Range */}
                            <div className={styles.filterSection}>
                                <h3 className={styles.filterTitle}>Prix</h3>
                                <div className={styles.priceRange}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                        className={styles.rangeInput}
                                    />
                                    <div className={styles.priceLabels}>
                                        <span>0 DT</span>
                                        <span>{priceRange[1]} DT</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gluten Free */}
                            <div className={styles.filterSection}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={isGlutenFree}
                                        onChange={(e) => setIsGlutenFree(e.target.checked)}
                                        className={styles.checkboxInput}
                                    />
                                    <span>Sans Gluten</span>
                                </label>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategorySlugs([]);
                                    setPriceRange([0, 200]);
                                    setIsGlutenFree(false);
                                    router.push('/collection');
                                }}
                                className={styles.clearButton}
                            >
                                Réinitialiser les filtres
                            </button>
                        </aside>

                        {/* Products Grid */}
                        <div className={styles.main}>
                            {/* Toolbar */}
                            <div className={styles.toolbar}>
                                <span className={styles.resultCount}>
                                    {products.length} produit{products.length > 1 ? 's' : ''}
                                </span>
                                <div className={styles.toolbarRight}>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className={styles.sortSelect}
                                    >
                                        <option value="newest">Nouveautés</option>
                                        <option value="name">Nom (A-Z)</option>
                                        <option value="price_asc">Prix croissant</option>
                                        <option value="price_desc">Prix décroissant</option>
                                    </select>
                                </div>
                            </div>

                            {/* Grid */}
                            {products.length > 0 ? (
                                <div className={styles.grid}>
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noResults}>
                                    <div className={styles.noResultsIcon}>🔍</div>
                                    <h3>Aucun produit trouvé</h3>
                                    <p>Dans cette catégorie ou avec ces filtres.</p>
                                    <button
                                        onClick={() => router.push('/collection')}
                                        className={styles.resetButton}
                                    >
                                        Voir toute la collection
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
