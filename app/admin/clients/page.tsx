"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { CustomerSafe } from '@/lib/types/customer';
import { Trash2, User } from 'lucide-react';

export default function AdminClientsPage() {
    const [customers, setCustomers] = useState<CustomerSafe[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/admin/customers');
            const data = await res.json();
            if (data.success) {
                setCustomers(data.data);
            }
        } catch (err) {
            console.error('Error fetching customers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${email} ?`)) return;

        try {
            const res = await fetch(`/api/admin/customers?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCustomers(customers.filter(c => c.id !== id));
            }
        } catch (err) {
            console.error('Error deleting customer:', err);
        }
    };

    if (isLoading) return <div className={styles.page}>Chargement...</div>;

    return (
        <div className={styles.page}>
            <div className={styles.titleSection}>
                <h1 className={styles.title}>Gestion des Clients</h1>
            </div>

            <div className={styles.tableContainer}>
                {customers.length === 0 ? (
                    <div className={styles.empty}>Aucun client inscrit pour le moment.</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Client</th>
                                <th className={styles.th}>Nom d'utilisateur</th>
                                <th className={styles.th}>Date d'inscription</th>
                                <th className={styles.th}>Dernière connexion</th>
                                <th className={styles.th}>Statut</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c) => (
                                <tr key={c.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div className={styles.customerInfo}>
                                            <span style={{ fontWeight: 600 }}>{c.firstName || ''} {c.lastName || ''}</span>
                                            <span className={styles.email}>{c.email}</span>
                                        </div>
                                    </td>
                                    <td className={styles.td}>{c.username}</td>
                                    <td className={styles.td}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                                    <td className={styles.td}>
                                        {c.lastLogin ? new Date(c.lastLogin).toLocaleString('fr-FR') : 'Jamais'}
                                    </td>
                                    <td className={styles.td}>
                                        <span className={`${styles.status} ${c.isActive ? styles.statusActive : styles.statusInactive}`}>
                                            {c.isActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(c.id, c.email)}
                                                title="Supprimer le client"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
