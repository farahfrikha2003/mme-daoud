'use client';

import { XmlDataItem } from '@/lib/xml/types';

interface XmlDataCardProps {
  item: XmlDataItem;
  onEdit: (item: XmlDataItem) => void;
  onDelete: (id: string) => void;
}

export function XmlDataCard({ item, onEdit, onDelete }: XmlDataCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {item.description}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            title="Modifier"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded"
            title="Supprimer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Champs personnalisés */}
      {Object.entries(item).map(([key, value]) => {
        if (['id', 'title', 'description', 'createdAt', 'updatedAt'].includes(key)) {
          return null;
        }
        return (
          <div key={key} className="mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {key}:
            </span>
            <span className="ml-2 text-sm text-gray-900">
              {String(value)}
            </span>
          </div>
        );
      })}

      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
        <div>Créé: {formatDate(item.createdAt)}</div>
        <div>Modifié: {formatDate(item.updatedAt)}</div>
      </div>
    </div>
  );
}