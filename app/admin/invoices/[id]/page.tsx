"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import orderStyles from '../../orders/page.module.css';
import styles from './invoice.module.css';

type Settings = {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  tvaNumber?: string;
  currency?: string;
  currencySymbol?: string;
};

const statusLabel: Record<string, string> = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  paid: 'Payée',
  overdue: 'En retard',
  cancelled: 'Annulée',
};

function formatDate(s: string) {
  if (!s) return '—';
  const d = new Date(s);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [invoice, setInvoice] = useState<Record<string, unknown> | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/admin/invoices/${id}`).then((r) => r.json()),
      fetch('/api/admin/settings').then((r) => r.json()),
    ])
      .then(([invRes, setRes]) => {
        if (invRes.success) setInvoice(invRes.data);
        if (setRes.success && setRes.data) setSettings(setRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={orderStyles.loading}>Chargement...</div>;
  if (!invoice) return <div className={orderStyles.empty}><p>Facture non trouvée</p></div>;

  const inv = invoice as {
    invoiceNumber?: string;
    createdAt?: string;
    dueDate?: string;
    status?: string;
    subtotal?: number;
    tvaAmount?: number;
    total?: number;
    notes?: string;
    customer?: Record<string, string>;
    lines?: Array<Record<string, unknown>>;
  };
  const c = inv.customer || {};
  const lines = inv.lines || [];
  const sym = settings?.currencySymbol ?? 'DT';
  const companyName = settings?.companyName ?? 'Mme Daoud';

  return (
    <div className={orderStyles.page}>
      <div className={styles.noPrint}>
        <Link href="/admin/invoices" className={orderStyles.viewButton}>← Liste des factures</Link>
        <button type="button" onClick={() => window.print()} className={orderStyles.addButton} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          🖨️ Imprimer
        </button>
      </div>
      <div id="invoice-print" className={styles.doc}>
        <header className={styles.docHeader}>
          <div className={styles.docLogo}>
            <Image src="/logo.png" alt={companyName} width={160} height={80} style={{ objectFit: 'contain' }} />
          </div>
          <div className={styles.docCompany}>
            <div className={styles.docCompanyName}>{companyName}</div>
            <div className={styles.docCompanyMeta}>
              {settings?.companyAddress && <p>{settings.companyAddress}</p>}
              {settings?.companyPhone && <p>Tél. {settings.companyPhone}</p>}
              {settings?.companyEmail && <p>{settings.companyEmail}</p>}
              {settings?.tvaNumber && <p>N° TVA : {settings.tvaNumber}</p>}
            </div>
          </div>
          <div className={styles.docTitleBlock}>
            <h1 className={styles.docTitle}>FACTURE</h1>
            <p className={styles.docRef}>{inv.invoiceNumber}</p>
            <p className={styles.docMeta}>Date : {formatDate(inv.createdAt)}</p>
            <p className={styles.docMeta}>Échéance : {formatDate(inv.dueDate)}</p>
            <p className={styles.docMeta}>Statut : {statusLabel[inv.status ?? ''] ?? inv.status}</p>
          </div>
        </header>

        <section className={styles.docParties}>
          <div>
            <div className={styles.docSectionLabel}>Facturé à</div>
            <div className={styles.docAddress}>
              <strong>{c.firstName} {c.lastName}</strong>
              {c.email && <p>{c.email}</p>}
              {c.phone && <p>{c.phone}</p>}
              {(c.address || c.city) && (
                <p>
                  {[c.address, [c.postalCode, c.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className={styles.docTableWrap}>
          <table className={styles.docTable}>
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Qté</th>
                <th>Unité</th>
                <th className={styles.num}>P.U. HT</th>
                <th className={styles.num}>Total HT</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l: Record<string, unknown>, i: number) => (
                <tr key={i}>
                  <td>{String(l.productName)}</td>
                  <td>{String(l.quantity)}</td>
                  <td>{String(l.unit)}</td>
                  <td className={styles.num}>{Number(l.unitPrice).toFixed(2)} {sym}</td>
                  <td className={styles.num}>{Number(l.total).toFixed(2)} {sym}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.docTotals}>
          <div className={styles.docTotalsRow}>
            <span>Sous-total HT</span>
            <span>{Number(inv.subtotal).toFixed(2)} {sym}</span>
          </div>
          {Number(inv.tvaAmount) > 0 && (
            <div className={styles.docTotalsRow}>
              <span>TVA</span>
              <span>{Number(inv.tvaAmount).toFixed(2)} {sym}</span>
            </div>
          )}
          <div className={styles.docTotalsRow}>
            <span>Total TTC</span>
            <span>{Number(inv.total).toFixed(2)} {sym}</span>
          </div>
        </div>

        {inv.notes && (
          <div className={styles.docFooter}>
            <p><strong>Notes :</strong> {inv.notes}</p>
          </div>
        )}
        <div className={styles.docFooter}>
          <p>Conditions de paiement : à réception de facture, selon échéance indiquée.</p>
          <p>En cas de retard de paiement, des pénalités pourront être appliquées.</p>
        </div>
      </div>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 2rem 2.5rem !important;
            background: #fff !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}
