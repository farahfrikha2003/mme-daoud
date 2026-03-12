"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../orders/page.module.css';

export default function AdminSupplierDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [supplier, setSupplier] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/suppliers/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSupplier(d.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!supplier) return <div className={styles.empty}><p>Fournisseur non trouvé</p></div>;

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/admin/suppliers" className={styles.viewButton} style={{ marginRight: 8 }}>← Liste des fournisseurs</Link>
      </div>
      <div style={{ background: 'var(--color-bg-white)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(201,169,141,0.15)' }}>
        <h2 style={{ color: 'var(--color-primary-brown)' }}>{(supplier as { name?: string }).name}</h2>
        <p><strong>Contact :</strong> {(supplier as { contactName?: string }).contactName || '-'}</p>
        <p><strong>Email :</strong> {(supplier as { email?: string }).email}</p>
        <p><strong>Téléphone :</strong> {(supplier as { phone?: string }).phone}</p>
        <p><strong>Adresse :</strong> {(supplier as { address?: string }).address || '-'} {(supplier as { city?: string }).city} {(supplier as { postalCode?: string }).postalCode}</p>
        <p><strong>N° TVA :</strong> {(supplier as { tvaNumber?: string }).tvaNumber || '-'}</p>
        <p><strong>Actif :</strong> {(supplier as { isActive?: boolean }).isActive ? 'Oui' : 'Non'}</p>
      </div>
    </div>
  );
}
