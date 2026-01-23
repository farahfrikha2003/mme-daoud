"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './CategoryTreeSelect.module.css';
import { FlattenedCategory, flattenCategoryTree } from '@/lib/utils/categoryUtils';

interface Category {
    id: string;
    slug: string;
    name: string;
    order: number;
    parentId?: string;
}

interface CategoryTreeSelectProps {
    categories: Category[];
    value: string; // current categorySlug
    onChange: (slug: string) => void;
    placeholder?: string;
}

export default function CategoryTreeSelect({ categories, value, onChange, placeholder = "Sélectionner une catégorie" }: CategoryTreeSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const flattened = React.useMemo(() => flattenCategoryTree(categories), [categories]);
    const selectedCategory = flattened.find(c => c.slug === value);

    const filteredCategories = React.useMemo(() => {
        if (!searchQuery) return flattened;
        const query = searchQuery.toLowerCase();
        return flattened.filter(c => c.name.toLowerCase().includes(query));
    }, [flattened, searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (slug: string) => {
        onChange(slug);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <div
                className={`${styles.selectHead} ${isOpen ? styles.active : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedCategory ? styles.value : styles.placeholder}>
                    {selectedCategory ? selectedCategory.name : placeholder}
                </span>
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                            autoFocus
                        />
                    </div>
                    <div className={styles.list}>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`${styles.item} ${value === cat.slug ? styles.selected : ''}`}
                                    style={{ paddingLeft: `${cat.level * 1.5 + 1}rem` }}
                                    onClick={() => handleSelect(cat.slug)}
                                >
                                    {cat.level > 0 && <span className={styles.treeLine}></span>}
                                    <span className={styles.itemIcon}>
                                        {cat.level === 0 ? '📁' : '🏷️'}
                                    </span>
                                    <span className={styles.itemName}>{cat.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>Aucune catégorie trouvée</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
