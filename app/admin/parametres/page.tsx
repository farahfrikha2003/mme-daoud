"use client";

import React, { useEffect, useState } from 'react';
import styles from '../orders/page.module.css';

interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  tvaNumber: string;
  tvaRate: number;
  currency: string;
  currencySymbol: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function AdminParametresPage() {
  const [tab, setTab] = useState<'config' | 'users'>('config');
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState<AppSettings>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    tvaNumber: '',
    tvaRate: 19,
    currency: 'TND',
    currencySymbol: 'DT',
  });

  useEffect(() => {
    if (tab === 'config') fetchSettings();
    else fetchUsers();
  }, [tab]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        setForm({
          companyName: data.data.companyName ?? '',
          companyAddress: data.data.companyAddress ?? '',
          companyPhone: data.data.companyPhone ?? '',
          companyEmail: data.data.companyEmail ?? '',
          tvaNumber: data.data.tvaNumber ?? '',
          tvaRate: data.data.tvaRate ?? 19,
          currency: data.data.currency ?? 'TND',
          currencySymbol: data.data.currencySymbol ?? 'DT',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        setMessage('Paramètres enregistrés.');
      } else setMessage(data.error || 'Erreur');
    } catch (e) {
      setMessage('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header} style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setTab('config')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: tab === 'config' ? 'var(--color-primary-gold)' : 'var(--color-bg-warm)',
            color: tab === 'config' ? 'white' : 'var(--color-text-dark)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Configuration
        </button>
        <button
          type="button"
          onClick={() => setTab('users')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: tab === 'users' ? 'var(--color-primary-gold)' : 'var(--color-bg-warm)',
            color: tab === 'users' ? 'white' : 'var(--color-text-dark)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Utilisateurs
        </button>
      </div>

      {tab === 'config' && (
        <>
          {isLoading ? (
            <div className={styles.loading}>Chargement...</div>
          ) : (
            <div style={{ background: 'var(--color-bg-white)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(201,169,141,0.15)', maxWidth: 600 }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary-brown)' }}>Configuration de l&apos;application</h3>
              <form onSubmit={saveSettings}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label>
                    <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Nom de l&apos;entreprise</span>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Adresse</span>
                    <input
                      type="text"
                      value={form.companyAddress}
                      onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Téléphone</span>
                    <input
                      type="text"
                      value={form.companyPhone}
                      onChange={(e) => setForm({ ...form, companyPhone: e.target.value })}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Email</span>
                    <input
                      type="email"
                      value={form.companyEmail}
                      onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Numéro TVA</span>
                    <input
                      type="text"
                      value={form.tvaNumber}
                      onChange={(e) => setForm({ ...form, tvaNumber: e.target.value })}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Taux TVA (%)</span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.tvaRate}
                      onChange={(e) => setForm({ ...form, tvaRate: parseFloat(e.target.value) || 0 })}
                      className={styles.searchInput}
                    />
                  </label>
                  <label>
                    <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Devise (code)</span>
                    <input
                      type="text"
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className={styles.searchInput}
                      placeholder="TND, EUR, USD"
                    />
                  </label>
                  <label>
                    <span style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Symbole devise</span>
                    <input
                      type="text"
                      value={form.currencySymbol}
                      onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                      className={styles.searchInput}
                      placeholder="د.ت, €, $"
                    />
                  </label>
                </div>
                {message && <p style={{ marginTop: '1rem', color: 'var(--color-primary-brown)' }}>{message}</p>}
                <button
                  type="submit"
                  disabled={saving}
                  className={styles.viewButton}
                  style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem' }}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {tab === 'users' && (
        <>
          {isLoading ? (
            <div className={styles.loading}>Chargement...</div>
          ) : users.length === 0 ? (
            <div className={styles.empty}><p>Aucun utilisateur</p></div>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader} style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr' }}>
                <span>Identifiant</span>
                <span>Email</span>
                <span>Rôle</span>
                <span>Statut</span>
              </div>
              {users.map((u) => (
                <div key={u.id} className={styles.tableRow} style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr' }}>
                  <span className={styles.customerName}>{u.username}</span>
                  <span className={styles.customerEmail}>{u.email}</span>
                  <span>{u.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
                  <span>{u.isActive ? 'Actif' : 'Inactif'}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
