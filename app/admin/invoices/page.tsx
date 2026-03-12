"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../orders/page.module.css';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: { firstName: string; lastName: string; email: string };
  total: number;
  status: string;
  dueDate: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  paid: 'Payée',
  overdue: 'En retard',
  cancelled: 'Annulée',
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    try {
      let url = '/api/admin/invoices';
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setInvoices(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = invoices;

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
        <Link href="/admin/invoices/new" className={styles.addButton}>
          + Ajouter une facture
        </Link>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucune facture</p>
          <Link href="/admin/invoices/new" className={styles.addButton} style={{ marginTop: '1rem' }}>+ Ajouter une facture</Link>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader} style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1.2fr 1fr 1fr' }}>
            <span>N° Facture</span>
            <span>Client</span>
            <span>Total</span>
            <span>Statut</span>
            <span>Échéance</span>
            <span>Actions</span>
          </div>
          {filtered.map((inv) => (
            <div key={inv.id} className={styles.tableRow} style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1.2fr 1fr 1fr' }}>
              <span className={styles.orderNumber}>{inv.invoiceNumber}</span>
              <div className={styles.customer}>
                <div className={styles.customerName}>{inv.customer.firstName} {inv.customer.lastName}</div>
                <div className={styles.customerEmail}>{inv.customer.email}</div>
              </div>
              <span className={styles.total}>{inv.total.toFixed(2)}</span>
              <span>{statusLabels[inv.status] || inv.status}</span>
              <span className={styles.date}>{new Date(inv.dueDate).toLocaleDateString('fr-FR')}</span>
              <Link href={`/admin/invoices/${inv.id}`} className={styles.viewButton}>Voir</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
