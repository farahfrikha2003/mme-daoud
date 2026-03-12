"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../orders/page.module.css';

interface DeliveryNote {
  id: string;
  deliveryNumber: string;
  orderId: string;
  customer: { firstName: string; lastName: string; address: string };
  status: string;
  deliveryDate?: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  preparing: 'En préparation',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

export default function AdminDeliveryNotesPage() {
  const [notes, setNotes] = useState<DeliveryNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [statusFilter]);

  const fetchNotes = async () => {
    try {
      let url = '/api/admin/delivery-notes';
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setNotes(data.data);
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : notes.length === 0 ? (
        <div className={styles.empty}><p>Aucun bon de livraison</p></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader} style={{ gridTemplateColumns: '1.5fr 1.5fr 2fr 1.2fr 1fr 1fr' }}>
            <span>N° Bon</span>
            <span>Commande</span>
            <span>Client / Adresse</span>
            <span>Statut</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {notes.map((n) => (
            <div key={n.id} className={styles.tableRow} style={{ gridTemplateColumns: '1.5fr 1.5fr 2fr 1.2fr 1fr 1fr' }}>
              <span className={styles.orderNumber}>{n.deliveryNumber}</span>
              <span className={styles.items}>{n.orderId}</span>
              <div className={styles.customer}>
                <div className={styles.customerName}>{n.customer.firstName} {n.customer.lastName}</div>
                <div className={styles.customerEmail}>{n.customer.address}</div>
              </div>
              <span>{statusLabels[n.status] || n.status}</span>
              <span className={styles.date}>{n.deliveryDate ? new Date(n.deliveryDate).toLocaleDateString('fr-FR') : '-'}</span>
              <Link href={`/admin/delivery-notes/${n.id}`} className={styles.viewButton}>Voir</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
