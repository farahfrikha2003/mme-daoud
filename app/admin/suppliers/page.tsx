"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../orders/page.module.css';

interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email: string;
  phone: string;
  city?: string;
  isActive: boolean;
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/admin/suppliers');
      const data = await res.json();
      if (data.success) setSuppliers(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.contactName && s.contactName.toLowerCase().includes(search.toLowerCase())) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <input
          type="text"
          placeholder="Rechercher un fournisseur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {isLoading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}><p>Aucun fournisseur</p></div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader} style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 0.75fr 1fr' }}>
            <span>Nom</span>
            <span>Contact</span>
            <span>Email</span>
            <span>Téléphone</span>
            <span>Ville</span>
            <span>Actions</span>
          </div>
          {filtered.map((s) => (
            <div key={s.id} className={styles.tableRow} style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 0.75fr 1fr' }}>
              <span className={styles.customerName}>{s.name}</span>
              <span className={styles.customerEmail}>{s.contactName || '-'}</span>
              <span className={styles.customerEmail}>{s.email}</span>
              <span>{s.phone}</span>
              <span className={styles.date}>{s.city || '-'}</span>
              <span>
                {s.isActive ? <span style={{ color: 'var(--color-primary-brown)' }}>Actif</span> : 'Inactif'}
                <Link href={`/admin/suppliers/${s.id}`} className={styles.viewButton} style={{ marginLeft: 8 }}>Voir</Link>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
