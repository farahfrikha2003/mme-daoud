"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { Order, OrderStatus } from '@/lib/types/admin';

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
    const [note, setNote] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/admin/orders/${id}`);
                const data = await response.json();
                if (data.success) {
                    setOrder(data.data);
                    setNewStatus(data.data.status);
                } else {
                    setError(data.error || 'Commande non trouvée');
                }
            } catch (err) {
                console.error(err);
                setError('Erreur lors du chargement de la commande');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!order) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    note: note.trim()
                })
            });

            const data = await response.json();
            if (data.success) {
                setOrder(data.data);
                setNote('');
                // Optional: show success message
            } else {
                alert(data.error || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            console.error(err);
            alert('Erreur de connexion');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div className={styles.loading}>Chargement...</div>;

    if (error || !order) {
        return (
            <div className={styles.page}>
                <div className={styles.error}>{error || 'Commande introuvable'}</div>
                <Link href="/admin/orders" className={styles.backButton}>
                    Retour aux commandes
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-TN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h1 className={styles.title}>
                        Commande #{order.orderNumber}
                    </h1>
                    <span className={styles.orderDate}>
                        Passée le {formatDate(order.createdAt)}
                    </span>
                </div>
                <Link href="/admin/orders" className={styles.backButton}>
                    &larr; Retour
                </Link>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainColumn} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Items */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Articles ({order.items.length})</h2>
                        <table className={styles.itemsTable}>
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Prix Unitaire</th>
                                    <th>Quantité</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={`${item.productId}-${index}`}>
                                        <td>
                                            <div className={styles.itemProduct}>
                                                <div className={styles.itemImage} style={{ position: 'relative', overflow: 'hidden' }}>
                                                    {/* Placeholder image since we don't have item image url in OrderItem type necessarily, 
                                                        but assuming productId might help if we fetched products separately.
                                                        For now, use a generic placeholder or try to find one if available.
                                                        The type OrderItem doesn't have imageUrl. I'll use a placeholder. */}
                                                    <div style={{
                                                        width: '100%', height: '100%',
                                                        background: '#f0f0f0', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '1.5rem'
                                                    }}>🍰</div>
                                                </div>
                                                <span className={styles.itemName}>{item.productName}</span>
                                            </div>
                                        </td>
                                        <td className={styles.itemPrice}>{item.unitPrice.toFixed(2)} TND</td>
                                        <td>{item.quantity}</td>
                                        <td className={styles.itemTotal}>{item.total.toFixed(2)} TND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>{order.total.toFixed(2)} TND</span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Information Client</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className={styles.infoGroup}>
                                <label className={styles.infoLabel}>Nom complet</label>
                                <div className={styles.infoValue}>
                                    {order.customer.firstName} {order.customer.lastName}
                                </div>
                            </div>
                            <div className={styles.infoGroup}>
                                <label className={styles.infoLabel}>Email</label>
                                <div className={styles.infoValue}>
                                    <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a>
                                </div>
                            </div>
                            <div className={styles.infoGroup}>
                                <label className={styles.infoLabel}>Téléphone</label>
                                <div className={styles.infoValue}>
                                    <a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a>
                                </div>
                            </div>
                            <div className={styles.infoGroup}>
                                <label className={styles.infoLabel}>Adresse de livraison</label>
                                <div className={styles.infoValue}>
                                    {order.customer.address}<br />
                                    {order.customer.postalCode} {order.customer.city}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.sideColumn} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Status Management */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>État de la commande</h2>
                        <div className={styles.statusControl}>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                                className={styles.statusSelect}
                                disabled={isUpdating}
                            >
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="processing">En préparation</option>
                                <option value="shipped">Expédiée / Prête</option>
                                <option value="delivered">Livrée / Récupérée</option>
                                <option value="cancelled">Annulée</option>
                            </select>

                            <textarea
                                className={styles.noteInput}
                                placeholder="Ajouter une note (optionnel)..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                disabled={isUpdating}
                            />

                            <button
                                className={styles.updateButton}
                                onClick={handleUpdateStatus}
                                disabled={isUpdating || newStatus === order.status}
                            >
                                {isUpdating ? 'Mise à jour...' : 'Mettre à jour le statut'}
                            </button>
                        </div>
                    </div>

                    {/* History */}
                    {order.history && order.history.length > 0 && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Historique</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {order.history.map((event, i) => (
                                    <div key={i} style={{
                                        padding: '0.75rem',
                                        background: 'var(--color-bg-warm)',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: '3px solid var(--color-primary-gold)'
                                    }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                            {event.status.toUpperCase()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                            {formatDate(event.timestamp)}
                                        </div>
                                        {event.note && (
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', fontStyle: 'italic' }}>
                                                "{event.note}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
