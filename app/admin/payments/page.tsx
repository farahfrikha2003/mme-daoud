"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../orders/page.module.css';

interface Payment {
  id: string;
  reference: string;
  orderId?: string;
  invoiceId?: string;
  type: string;
  amount: number;
  method: string;
  paidAt: string;
}

const typeLabels: Record<string, string> = {
  full: 'Complet',
  deposit: 'Accompte',
  balance: 'Solde',
  refund: 'Remboursement',
  adjustment: 'Ajustement',
};
const methodLabels: Record<string, string> = {
  cash: 'Espèces',
  card: 'Carte',
  check: 'Chèque',
  transfer: 'Virement',
  other: 'Autre',
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      if (data.success) setPayments(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span style={{ fontWeight: 600 }}>Paiements (acomptes, solde, remboursements)</span>
      </div>
      {isLoading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : payments.length === 0 ? (
        <div className={styles.empty}><p>Aucun paiement</p></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader} style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.5fr 1fr' }}>
            <span>Référence</span>
            <span>Type</span>
            <span>Montant</span>
            <span>Moyen</span>
            <span>Date</span>
            <span>Lien</span>
          </div>
          {payments.map((p) => (
            <div key={p.id} className={styles.tableRow} style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.5fr 1fr' }}>
              <span className={styles.orderNumber}>{p.reference}</span>
              <span>{typeLabels[p.type] || p.type}</span>
              <span className={styles.total}>{p.amount.toFixed(2)}</span>
              <span>{methodLabels[p.method] || p.method}</span>
              <span className={styles.date}>{new Date(p.paidAt).toLocaleDateString('fr-FR')}</span>
              <span className={styles.customerEmail}>
                {p.orderId && <Link href={`/admin/orders/${p.orderId}`}>Commande</Link>}
                {p.invoiceId && <Link href={`/admin/invoices/${p.invoiceId}`}> Facture</Link>}
                {!p.orderId && !p.invoiceId && '-'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
