'use client';

import { useState } from 'react';
import { XmlDataItem } from '@/lib/xml/types';
import { XmlDataCard } from './XmlDataCard';
import { XmlDataForm } from './XmlDataForm';
import { XmlSearchBar } from './XmlSearchBar';

interface XmlDataListProps {
  data: XmlDataItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreate: (item: any) => Promise<void>;
  onUpdate: (id: string, updates: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function XmlDataList({
  data,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onCreate,
  onUpdate,
  onDelete,
}: XmlDataListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<XmlDataItem | null>(null);

  const handleCreate = async (itemData: any) => {
    await onCreate(itemData);
    setShowForm(false);
  };

  const handleUpdate = async (itemData: any) => {
    if (editingItem) {
      await onUpdate(editingItem.id, itemData);
      setEditingItem(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      await onDelete(id);
    }
  };

  const handleEdit = (item: XmlDataItem) => {
    setEditingItem(item);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des données XML...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <XmlSearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onCreateClick={() => setShowForm(true)}
      />

      {/* Formulaire de création/édition */}
      {(showForm || editingItem) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingItem ? 'Modifier l\'élément' : 'Créer un nouvel élément'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <XmlDataForm
            initialData={editingItem || undefined}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Liste des éléments */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchQuery ? 'Aucun résultat trouvé' : 'Aucune donnée XML'}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Essayez de modifier vos termes de recherche.'
                : 'Commencez par créer votre première donnée XML.'
              }
            </p>
          </div>
        ) : (
          data.map((item) => (
            <XmlDataCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}