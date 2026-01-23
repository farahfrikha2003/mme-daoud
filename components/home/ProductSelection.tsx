"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/lib/types/product';
import styles from './ProductSelection.module.css';

// Produits de démonstration
const demoProducts: Product[] = [
    {
        id: '1',
        slug: 'boule-bjawia',
        name: 'Boule Bjawia',
        description: 'Délicieuse boule aux amandes et à la pâte d\'amande',
        composition: 'Amandes, sucre, miel, eau de rose',
        conservation: 'À conserver au frais, consommer sous 15 jours',
        price: 11.6,
        priceUnit: '100g',
        category: 'Collection',
        categorySlug: 'collection',
        images: ['/images/products/boule-bjawia.jpg'],
        isNew: false,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: true,
        piecesPerHundredGrams: 5,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        slug: 'marocain',
        name: 'Marocain',
        description: 'Pâtisserie traditionnelle aux amandes',
        composition: 'Amandes, miel, sucre glace',
        conservation: 'À conserver au frais, consommer sous 15 jours',
        price: 8.2,
        priceUnit: '100g',
        category: 'Collection',
        categorySlug: 'collection',
        images: ['/images/products/marocain.jpg'],
        isNew: false,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: true,
        piecesPerHundredGrams: 6,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '3',
        slug: 'samsa-noisette-pistache',
        name: 'Samsa Noisette Pistache',
        description: 'Samsa aux noisettes avec couverture pistache',
        composition: 'Noisettes, pistaches, miel, pâte filo',
        conservation: 'À conserver au frais, consommer sous 10 jours',
        price: 11.6,
        priceUnit: '100g',
        category: 'Collection',
        categorySlug: 'collection',
        images: ['/images/products/samsa.jpg'],
        isNew: true,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: false,
        piecesPerHundredGrams: 4,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '4',
        slug: 'twajen-citron',
        name: 'Twajen Citron',
        description: 'Twajen parfumé au citron',
        composition: 'Amandes, zeste de citron, sucre',
        conservation: 'À conserver au frais, consommer sous 15 jours',
        price: 7,
        priceUnit: '100g',
        category: 'Hlou Arbi',
        categorySlug: 'hlou-arbi',
        images: ['/images/products/twajen.jpg'],
        isNew: false,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: true,
        piecesPerHundredGrams: 8,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '5',
        slug: 'kaak-ambar',
        name: 'Kaak Ambar',
        description: 'Kaak traditionnel à l\'ambre',
        composition: 'Semoule, sucre, ambre',
        conservation: 'À conserver au sec, consommer sous 20 jours',
        price: 7.4,
        priceUnit: '100g',
        category: 'Hlou Arbi',
        categorySlug: 'hlou-arbi',
        images: ['/images/products/kaak.jpg'],
        isNew: false,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: false,
        piecesPerHundredGrams: 10,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '6',
        slug: 'calisson-pistache',
        name: 'Calisson Pistache',
        description: 'Calisson délicat à la pistache',
        composition: 'Pistaches, amandes, sucre, eau de fleur d\'oranger',
        conservation: 'À conserver au frais, consommer sous 15 jours',
        price: 19,
        priceUnit: '100g',
        category: 'Collection',
        categorySlug: 'collection',
        images: ['/images/products/calisson-pistache.jpg'],
        isNew: true,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: true,
        piecesPerHundredGrams: 5,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '7',
        slug: 'calisson-moka',
        name: 'Calisson Moka',
        description: 'Calisson au café moka',
        composition: 'Amandes, café, sucre',
        conservation: 'À conserver au frais, consommer sous 15 jours',
        price: 10.8,
        priceUnit: '100g',
        category: 'Collection',
        categorySlug: 'collection',
        images: ['/images/products/calisson-moka.jpg'],
        isNew: false,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: true,
        piecesPerHundredGrams: 5,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '8',
        slug: 'mlabbes-noisette',
        name: 'Mlabbes Noisette',
        description: 'Mlabbes croquant aux noisettes',
        composition: 'Noisettes, sucre, blanc d\'oeuf',
        conservation: 'À conserver au sec, consommer sous 20 jours',
        price: 9.8,
        priceUnit: '100g',
        category: 'Hlou Arbi',
        categorySlug: 'hlou-arbi',
        images: ['/images/products/mlabbes-noisette.jpg'],
        isNew: false,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: true,
        piecesPerHundredGrams: 12,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '9',
        slug: 'mlabbes-moka',
        name: 'Mlabbes Moka',
        description: 'Mlabbes au café moka',
        composition: 'Amandes, café, sucre',
        conservation: 'À conserver au sec, consommer sous 20 jours',
        price: 9.6,
        priceUnit: '100g',
        category: 'Hlou Arbi',
        categorySlug: 'hlou-arbi',
        images: ['/images/products/mlabbes-moka.jpg'],
        isNew: false,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: true,
        piecesPerHundredGrams: 12,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '10',
        slug: 'boule-mosaique',
        name: 'Boule Mosaïque',
        description: 'Boule décorée en mosaïque',
        composition: 'Amandes, pistaches, fruits confits',
        conservation: 'À conserver au frais, consommer sous 10 jours',
        price: 23,
        priceUnit: '100g',
        category: 'Collection',
        categorySlug: 'collection',
        images: ['/images/products/boule-mosaique.jpg'],
        isNew: true,
        isPromo: false,
        isFeatured: true,
        isGlutenFree: true,
        piecesPerHundredGrams: 4,
        minQuantity: 100,
        stock: 'in_stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export default function ProductSelection() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                if (data.success) {
                    // Filtrer les produits mis en avant (featured)
                    const featured = data.data.filter((p: Product) => p.isFeatured);
                    // Si pas assez de featured, prendre les derniers produits
                    if (featured.length < 4) {
                        setProducts(data.data.slice(0, 8));
                    } else {
                        setProducts(featured);
                    }
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h2 className={styles.title}>Notre Sélection</h2>
                        <p className={styles.subtitle}>Découvrez nos best-sellers !</p>
                    </div>
                    <div className={styles.navigation}>
                        <button onClick={() => scroll('left')} className={styles.navButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <button onClick={() => scroll('right')} className={styles.navButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={styles.carouselWrapper}>
                    {isLoading ? (
                        <div className={styles.loading}>Chargement de la sélection...</div>
                    ) : (
                        <div ref={scrollRef} className={styles.carousel}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.carouselItem}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <Link href="/collection" className={styles.viewAllLink}>
                        Voir toute la collection
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
