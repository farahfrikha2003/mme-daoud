"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types/product';

interface FavoritesContextType {
    favorites: Product[];
    addFavorite: (product: Product) => void;
    removeFavorite: (productId: string) => void;
    toggleFavorite: (product: Product) => void;
    isFavorite: (productId: string) => boolean;
    clearFavorites: () => void;
    favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'mme-daoud-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<Product[]>([]);

    // Charger les favoris depuis localStorage au montage
    useEffect(() => {
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (savedFavorites) {
            try {
                const parsedFavorites = JSON.parse(savedFavorites);
                setFavorites(parsedFavorites);
            } catch (error) {
                console.error('Erreur lors du chargement des favoris:', error);
            }
        }
    }, []);

    // Sauvegarder les favoris dans localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (product: Product) => {
        setFavorites(prev => {
            if (prev.some(p => p.id === product.id)) {
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFavorite = (productId: string) => {
        setFavorites(prev => prev.filter(p => p.id !== productId));
    };

    const toggleFavorite = (product: Product) => {
        if (isFavorite(product.id)) {
            removeFavorite(product.id);
        } else {
            addFavorite(product);
        }
    };

    const isFavorite = (productId: string): boolean => {
        return favorites.some(p => p.id === productId);
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                addFavorite,
                removeFavorite,
                toggleFavorite,
                isFavorite,
                clearFavorites,
                favoritesCount: favorites.length
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
