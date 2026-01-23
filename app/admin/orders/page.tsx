"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    items: Array<{ productName: string; quantity: number; total: number }>;
    total: number;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            let url = '/api/admin/orders';
            if (statusFilter) url += `?status=${statusFilter}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const filteredOrders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(search.toLowerCase())
    );

    const statusLabels: Record<string, string> = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        processing: 'En préparation',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée'
    };

    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <input
                    type="text"
                    placeholder="Rechercher une commande..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">Tous les statuts</option>
                    {statuses.map(s => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Chargement...</div>
            ) : filteredOrders.length === 0 ? (
                <div className={styles.empty}>
                    <p>Aucune commande</p>
                </div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Commande</span>
                        <span>Client</span>
                        <span>Articles</span>
                        <span>Total</span>
                        <span>Statut</span>
                        <span>Date</span>
                        <span>Actions</span>
                    </div>
                    {filteredOrders.map((order) => (
                        <div key={order.id} className={styles.tableRow}>
                            <span className={styles.orderNumber}>{order.orderNumber}</span>
                            <div className={styles.customer}>
                                <div className={styles.customerName}>
                                    {order.customer.firstName} {order.customer.lastName}
                                </div>
                                <div className={styles.customerEmail}>{order.customer.email}</div>
                            </div>
                            <span className={styles.items}>{order.items.length} article(s)</span>
                            <span className={styles.total}>{order.total.toFixed(2)} DT</span>
                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                className={`${styles.statusSelect} ${styles[`status_${order.status}`]}`}
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{statusLabels[s]}</option>
                                ))}
                            </select>
                            <span className={styles.date}>
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                            <Link href={`/admin/orders/${order.id}`} className={styles.viewButton}>
                                Voir
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
