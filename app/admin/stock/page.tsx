"use client";

import React, { useEffect, useState } from 'react';
import styles from '../orders/page.module.css';

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: string;
  quantity: number;
  unit: string;
  reason?: string;
  reference?: string;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  in: 'Entrée',
  out: 'Sortie',
  adjustment: 'Ajustement',
  transfer: 'Transfert',
};

export default function AdminStockPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchMovements();
  }, [typeFilter]);

  const fetchMovements = async () => {
    try {
      let url = '/api/admin/stock';
      if (typeFilter) url += `?type=${typeFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setMovements(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Tous les types</option>
          {Object.entries(typeLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : movements.length === 0 ? (
        <div className={styles.empty}><p>Aucun mouvement de stock</p></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr' }}>
            <span>Produit</span>
            <span>Type</span>
            <span>Quantité</span>
            <span>Unité</span>
            <span>Référence / Motif</span>
            <span>Date</span>
          </div>
          {movements.map((m) => (
            <div key={m.id} className={styles.tableRow} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr' }}>
              <span className={styles.customerName}>{m.productName}</span>
              <span>{typeLabels[m.type] || m.type}</span>
              <span className={styles.total}>{m.quantity}</span>
              <span>{m.unit}</span>
              <span className={styles.customerEmail}>{m.reference || m.reason || '-'}</span>
              <span className={styles.date}>{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
