'use client';

import { useState, useEffect, useCallback } from 'react';
import { XmlDataItem, CreateXmlDataRequest, UpdateXmlDataRequest } from '@/lib/xml/types';

interface UseXmlDataReturn {
  data: XmlDataItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createItem: (item: CreateXmlDataRequest) => Promise<void>;
  updateItem: (id: string, updates: UpdateXmlDataRequest) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useXmlData(): UseXmlDataReturn {
  const [data, setData] = useState<XmlDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);

      const url = query
        ? `/api/xml-data?search=${encodeURIComponent(query)}`
        : '/api/xml-data';

      const response = await fetch(url);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la récupération des données');
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (item: CreateXmlDataRequest) => {
    try {
      setError(null);

      const response = await fetch('/api/xml-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la création');
      }

      // Actualiser les données
      await fetchData(searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  }, [fetchData, searchQuery]);

  const updateItem = useCallback(async (id: string, updates: UpdateXmlDataRequest) => {
    try {
      setError(null);

      const response = await fetch(`/api/xml-data/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la mise à jour');
      }

      // Actualiser les données
      await fetchData(searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [fetchData, searchQuery]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/xml-data/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la suppression');
      }

      // Actualiser les données
      await fetchData(searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchData, searchQuery]);

  const refreshData = useCallback(async () => {
    await fetchData(searchQuery);
  }, [fetchData, searchQuery]);

  // Effect pour charger les données initiales
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect pour gérer la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData(searchQuery);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchData]);

  return {
    data,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    createItem,
    updateItem,
    deleteItem,
    refreshData,
  };
}