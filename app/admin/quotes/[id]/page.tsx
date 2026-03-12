"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../orders/page.module.css';

export default function AdminQuoteDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/quotes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setQuote(d.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!quote) return <div className={styles.empty}><p>Devis non trouvé</p></div>;

  const c = quote.customer as Record<string, string>;
  const lines = (quote.lines as Array<Record<string, unknown>>) || [];

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/admin/quotes" className={styles.viewButton} style={{ marginRight: 8 }}>← Liste des devis</Link>
      </div>
      <div style={{ background: 'var(--color-bg-white)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(201,169,141,0.15)' }}>
        <h2 style={{ color: 'var(--color-primary-brown)' }}>Devis {(quote as { quoteNumber?: string }).quoteNumber}</h2>
        <p><strong>Client :</strong> {c?.firstName} {c?.lastName} – {c?.email}</p>
        <p><strong>Total :</strong> {(quote as { total?: number }).total} – <strong>Statut :</strong> {(quote as { status?: string }).status}</p>
        <p><strong>Valide jusqu&apos;au :</strong> {(quote as { validUntil?: string }).validUntil}</p>
        {lines.length > 0 && (
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,169,141,0.3)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Produit</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Qté</th>
                <th style={{ textAlign: 'right', padding: 8 }}>P.U.</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l: Record<string, unknown>, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(201,169,141,0.15)' }}>
                  <td style={{ padding: 8 }}>{String(l.productName)}</td>
                  <td style={{ textAlign: 'right', padding: 8 }}>{String(l.quantity)} {String(l.unit)}</td>
                  <td style={{ textAlign: 'right', padding: 8 }}>{Number(l.unitPrice)?.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: 8 }}>{Number(l.total)?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
