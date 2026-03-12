"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../orders/page.module.css';

interface ProductOption {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
}

const defaultCustomer = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  company: '',
};
const defaultLine = { productId: '', productName: '', quantity: 1, unit: 'Kg', unitPrice: 0, total: 0 };

export default function AdminNewQuotePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState(defaultCustomer);
  const [lines, setLines] = useState([{ ...defaultLine }]);
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setProducts(d.data.map((p: { id: string; name: string; price: number; promoPrice?: number; priceUnit?: string }) => ({
            id: p.id,
            name: p.name,
            price: Number(p.promoPrice ?? p.price),
            priceUnit: p.priceUnit || 'Kg',
          })));
        }
      })
      .catch(() => {});
  }, []);

  const parseNum = (v: string | number): number => {
    if (typeof v === 'number' && !isNaN(v)) return v;
    const s = String(v).replace(',', '.').trim();
    if (s === '') return 0;
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  const updateLine = (index: number, field: string, value: string | number) => {
    const next = [...lines];
    if (field === 'quantity') {
      const num = parseNum(value);
      next[index].quantity = num >= 0 ? num : next[index].quantity;
      next[index].total = Math.round(next[index].quantity * next[index].unitPrice * 100) / 100;
    } else if (field === 'unitPrice') {
      const num = parseNum(value);
      next[index].unitPrice = num >= 0 ? num : next[index].unitPrice;
      next[index].total = Math.round(next[index].quantity * next[index].unitPrice * 100) / 100;
    } else {
      (next[index] as Record<string, unknown>)[field] = value;
    }
    setLines(next);
  };

  const selectProduct = (index: number, value: string) => {
    const next = [...lines];
    if (value === '' || value === 'custom') {
      next[index] = { ...defaultLine, productId: value || 'custom', productName: next[index].productId === 'custom' ? next[index].productName : '' };
    } else {
      const product = products.find((p) => p.id === value);
      if (product) {
        const q = next[index].quantity || 1;
        const unitPrice = Number(product.price);
        next[index] = {
          productId: product.id,
          productName: product.name,
          quantity: q,
          unit: product.priceUnit,
          unitPrice,
          total: Math.round(q * unitPrice * 100) / 100,
        };
      }
    }
    setLines(next);
  };

  const isCatalogProduct = (line: { productId: string }) => line.productId && line.productId !== 'custom';

  const addLine = () => setLines([...lines, { ...defaultLine }]);
  const removeLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const subtotal = lines.reduce((s, l) => s + l.total, 0);
    const tvaAmount = Math.round(subtotal * 0.19 * 100) / 100;
    const total = Math.round((subtotal + tvaAmount) * 100) / 100;

    const payload = {
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        postalCode: customer.postalCode || '',
        company: customer.company || undefined,
      },
      lines: lines.map((l) => ({
        productId: l.productId || 'custom',
        productName: l.productName || 'Article',
        quantity: l.quantity,
        unit: l.unit,
        unitPrice: l.unitPrice,
        total: l.total,
      })),
      subtotal,
      tvaAmount,
      total,
      validUntil: validUntil || new Date().toISOString().slice(0, 10),
      notes: notes || undefined,
    };

    setSaving(true);
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        router.push(data.data?.id ? `/admin/quotes/${data.data.id}` : '/admin/quotes');
      } else {
        setError(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/admin/quotes" className={styles.viewButton}>
          ← Liste des devis
        </Link>
      </div>
      <div style={{ background: 'var(--color-bg-white)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 20px rgba(201, 169, 141, 0.08)', border: '1px solid rgba(201, 169, 141, 0.15)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(201, 169, 141, 0.2)', background: 'var(--color-bg-warm)' }}>
          <h2 className={styles.modalTitle}>Nouveau devis</h2>
        </div>
        <form onSubmit={submitQuote}>
          <div style={{ padding: '2rem', maxWidth: 640 }}>
            {error && <p className={styles.modalError}>{error}</p>}
            <section className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>Client</h3>
              <div className={styles.formGroup}>
                <label>Prénom *</label>
                <input type="text" required value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} className={styles.searchInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Nom *</label>
                <input type="text" required value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} className={styles.searchInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Email *</label>
                <input type="email" required value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className={styles.searchInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Téléphone</label>
                <input type="text" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className={styles.searchInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Société</label>
                <input type="text" value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} className={styles.searchInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Adresse</label>
                <input type="text" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className={styles.searchInput} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Ville</label>
                  <input type="text" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} className={styles.searchInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Code postal</label>
                  <input type="text" value={customer.postalCode} onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })} className={styles.searchInput} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Valide jusqu&apos;au *</label>
                <input type="date" required value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className={styles.searchInput} />
              </div>
            </section>
            <hr className={styles.modalDivider} />
            <section className={styles.modalSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 className={styles.modalSectionTitle} style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Lignes</h3>
                <button type="button" onClick={addLine} className={styles.viewButton}>+ Ligne</button>
              </div>
              <div className={styles.modalLinesCard}>
                <div className={styles.linesTableHeader}>
                  <span>Produit</span>
                  <span>Qté</span>
                  <span>Unité</span>
                  <span>P.U.</span>
                  <span>Total</span>
                  <span></span>
                </div>
                {lines.map((line, i) => (
                  <div key={i} className={styles.modalLineGrid}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <select
                        value={line.productId === 'custom' ? 'custom' : line.productId || ''}
                        onChange={(e) => selectProduct(i, e.target.value)}
                        className={styles.filterSelect}
                        style={{ width: '100%', minWidth: 0 }}
                      >
                        <option value="">Choisir un produit</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {p.price.toFixed(2)} {p.priceUnit}
                          </option>
                        ))}
                        <option value="custom">Autre (saisie libre)</option>
                      </select>
                      {line.productId === 'custom' && (
                        <input
                          placeholder="Désignation"
                          value={line.productName}
                          onChange={(e) => updateLine(i, 'productName', e.target.value)}
                          className={styles.searchInput}
                        />
                      )}
                    </div>
                    <input type="number" min={0} step={0.001} value={line.quantity || ''} onChange={(e) => updateLine(i, 'quantity', e.target.value)} className={styles.searchInput} title="Quantité" placeholder="0" />
                    <input placeholder="Unité" value={line.unit} onChange={(e) => updateLine(i, 'unit', e.target.value)} className={`${styles.searchInput} ${isCatalogProduct(line) ? styles.inputReadOnly : ''}`} readOnly={isCatalogProduct(line)} title="Unité" />
                    <input type="number" min={0} step={0.01} value={line.unitPrice ?? ''} onChange={(e) => updateLine(i, 'unitPrice', e.target.value)} className={`${styles.searchInput} ${isCatalogProduct(line) ? styles.inputReadOnly : ''}`} readOnly={isCatalogProduct(line)} title="Prix unitaire (du produit)" />
                    <span style={{ fontWeight: 600, color: 'var(--color-primary-brown)' }}>{(line.total ?? 0).toFixed(2)}</span>
                    <button type="button" onClick={() => removeLine(i)} className={styles.modalClose} style={{ marginBottom: 0, width: 36, height: 36 }}>✕</button>
                  </div>
                ))}
              </div>
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={styles.searchInput} rows={2} />
              </div>
            </section>
          </div>
          <div className={styles.modalActions}>
            <Link href="/admin/quotes" className={styles.viewButton}>Annuler</Link>
            <button type="submit" disabled={saving} className={styles.addButton}>{saving ? 'Création...' : 'Créer le devis'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
