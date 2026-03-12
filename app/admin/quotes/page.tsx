"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../orders/page.module.css';

interface Quote {
  id: string;
  quoteNumber: string;
  customer: { firstName: string; lastName: string; email: string };
  total: number;
  status: string;
  validUntil: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
  expired: 'Expiré',
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  const fetchQuotes = async () => {
    try {
      let url = '/api/admin/quotes';
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setQuotes(data.data);
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
        <Link href="/admin/quotes/new" className={styles.addButton}>
          + Nouveau devis
        </Link>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : quotes.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucun devis</p>
          <Link href="/admin/quotes/new" className={styles.addButton} style={{ marginTop: '1rem' }}>+ Nouveau devis</Link>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader} style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1.2fr 1fr 1fr' }}>
            <span>N° Devis</span>
            <span>Client</span>
            <span>Total</span>
            <span>Statut</span>
            <span>Valide jusqu&apos;au</span>
            <span>Actions</span>
          </div>
          {quotes.map((q) => (
            <div key={q.id} className={styles.tableRow} style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1.2fr 1fr 1fr' }}>
              <span className={styles.orderNumber}>{q.quoteNumber}</span>
              <div className={styles.customer}>
                <div className={styles.customerName}>{q.customer.firstName} {q.customer.lastName}</div>
                <div className={styles.customerEmail}>{q.customer.email}</div>
              </div>
              <span className={styles.total}>{q.total.toFixed(2)}</span>
              <span>{statusLabels[q.status] || q.status}</span>
              <span className={styles.date}>{new Date(q.validUntil).toLocaleDateString('fr-FR')}</span>
              <Link href={`/admin/quotes/${q.id}`} className={styles.viewButton}>Voir</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
