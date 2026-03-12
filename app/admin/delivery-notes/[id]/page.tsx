"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../orders/page.module.css';

export default function AdminDeliveryNoteDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [note, setNote] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/delivery-notes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setNote(d.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!note) return <div className={styles.empty}><p>Bon de livraison non trouvé</p></div>;

  const c = note.customer as Record<string, string>;
  const lines = (note.lines as Array<Record<string, unknown>>) || [];

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/admin/delivery-notes" className={styles.viewButton} style={{ marginRight: 8 }}>← Liste des bons de livraison</Link>
      </div>
      <div style={{ background: 'var(--color-bg-white)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(201,169,141,0.15)' }}>
        <h2 style={{ color: 'var(--color-primary-brown)' }}>Bon de livraison {(note as { deliveryNumber?: string }).deliveryNumber}</h2>
        <p><strong>Commande :</strong> {(note as { orderId?: string }).orderId}</p>
        <p><strong>Client :</strong> {c?.firstName} {c?.lastName} – {c?.address}, {c?.city}</p>
        <p><strong>Statut :</strong> {(note as { status?: string }).status} – <strong>Date livraison :</strong> {(note as { deliveryDate?: string }).deliveryDate || '-'}</p>
        {lines.length > 0 && (
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,169,141,0.3)' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Produit</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Quantité</th>
                <th style={{ textAlign: 'right', padding: 8 }}>Livrée</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l: Record<string, unknown>, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(201,169,141,0.15)' }}>
                  <td style={{ padding: 8 }}>{String(l.productName)}</td>
                  <td style={{ textAlign: 'right', padding: 8 }}>{String(l.quantity)} {String(l.unit)}</td>
                  <td style={{ textAlign: 'right', padding: 8 }}>{String(l.quantityDelivered ?? '-')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
