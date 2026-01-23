"use client";

import React from 'react';
import styles from './page.module.css';
import { Category } from '@/lib/types/product';

interface CategoryNode extends Category {
    children: CategoryNode[];
}

interface CategorySidebarProps {
    categories: CategoryNode[];
    selectedSlugs: string[];
    onToggle: (slug: string) => void;
}

const CategoryItem = ({
    category,
    selectedSlugs,
    onToggle,
    depth = 0
}: {
    category: CategoryNode;
    selectedSlugs: string[];
    onToggle: (slug: string) => void;
    depth?: number
}) => {
    const isChecked = selectedSlugs.includes(category.slug);

    return (
        <div className={styles.categoryItemWrapper}>
            <label
                className={styles.categoryCheckboxLabel}
                style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
            >
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(category.slug)}
                    className={styles.checkboxInput}
                />
                <span className={styles.categoryName}>{category.name}</span>
            </label>

            {category.children.length > 0 && (
                <div className={`${styles.subCategoryList} ${styles.alwaysOpen}`}>
                    {category.children.map(child => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            selectedSlugs={selectedSlugs}
                            onToggle={onToggle}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CategorySidebar({ categories, selectedSlugs, onToggle }: CategorySidebarProps) {
    return (
        <div className={styles.categoryList}>
            {categories.map((category) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    selectedSlugs={selectedSlugs}
                    onToggle={onToggle}
                />
            ))}
        </div>
    );
}
