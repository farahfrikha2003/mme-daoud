"use client";

import React, { useEffect, useState } from 'react';
import styles from '../orders/page.module.css';

type ReportType = 'sales' | 'stock';

interface SalesReport {
  totalOrders: number;
  totalRevenue: number;
  totalInvoices: number;
  totalInvoiced: number;
  totalPayments: number;
  totalPaid: number;
  byStatus: Record<string, number>;
}

interface StockReport {
  totalMovements: number;
  byType: Record<string, number>;
  recent: Array<{ productName: string; type: string; quantity: number; createdAt: string }>;
}

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [sales, setSales] = useState<SalesReport | null>(null);
  const [stock, setStock] = useState<StockReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?type=${reportType}`);
      const data = await res.json();
      if (data.success) {
        if (reportType === 'sales') setSales(data.data);
        else setStock(data.data);
      }
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
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
          className={styles.filterSelect}
        >
          <option value="sales">Rapport ventes / chiffre d&apos;affaires</option>
          <option value="stock">Rapport mouvements de stock</option>
        </select>
      </div>
      {isLoading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : reportType === 'sales' && sales ? (
        <div className={styles.table}>
          <div style={{ padding: '2rem', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(201,169,141,0.15)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-brown)' }}>Résumé ventes</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><strong>Nombre de commandes :</strong> {sales.totalOrders}</li>
              <li><strong>Chiffre d&apos;affaires (commandes) :</strong> {sales.totalRevenue?.toFixed(2)}</li>
              <li><strong>Nombre de factures :</strong> {sales.totalInvoices}</li>
              <li><strong>Montant facturé (payé) :</strong> {sales.totalInvoiced?.toFixed(2)}</li>
              <li><strong>Nombre de paiements :</strong> {sales.totalPayments}</li>
              <li><strong>Total encaissé :</strong> {sales.totalPaid?.toFixed(2)}</li>
            </ul>
            {sales.byStatus && Object.keys(sales.byStatus).length > 0 && (
              <>
                <h4 style={{ marginTop: '1.5rem' }}>Commandes par statut</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {Object.entries(sales.byStatus).map(([status, count]) => (
                    <li key={status}>{status}: {count}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : reportType === 'stock' && stock ? (
        <div className={styles.table}>
          <div style={{ padding: '2rem', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(201,169,141,0.15)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-brown)' }}>Rapport stock</h3>
            <p><strong>Total mouvements :</strong> {stock.totalMovements}</p>
            {stock.byType && Object.keys(stock.byType).length > 0 && (
              <p><strong>Par type :</strong> {Object.entries(stock.byType).map(([t, c]) => `${t}: ${c}`).join(', ')}</p>
            )}
            {stock.recent?.length > 0 && (
              <>
                <h4 style={{ marginTop: '1.5rem' }}>Derniers mouvements</h4>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
                  {stock.recent.slice(0, 20).map((m: { productName: string; type: string; quantity: number; createdAt: string }, i: number) => (
                    <li key={i}>{m.productName} – {m.type} – {m.quantity} – {new Date(m.createdAt).toLocaleDateString('fr-FR')}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.empty}><p>Aucune donnée</p></div>
      )}
    </div>
  );
}
