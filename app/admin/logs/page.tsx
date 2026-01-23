"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Log {
    id: string;
    adminUsername: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: string;
    timestamp: string;
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionFilter, setActionFilter] = useState('');
    const [entityFilter, setEntityFilter] = useState('');

    useEffect(() => {
        fetchLogs();
    }, [page, actionFilter, entityFilter]);

    const fetchLogs = async () => {
        try {
            let url = `/api/admin/logs?page=${page}&limit=50`;
            if (actionFilter) url += `&action=${actionFilter}`;
            if (entityFilter) url += `&entity=${entityFilter}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setLogs(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const actionLabels: Record<string, string> = {
        login: 'Connexion',
        logout: 'Déconnexion',
        create: 'Création',
        update: 'Modification',
        delete: 'Suppression',
        toggle: 'Activation',
        upload: 'Upload',
        status_change: 'Changement statut',
        view: 'Consultation'
    };

    const entityLabels: Record<string, string> = {
        admin: 'Admin',
        category: 'Catégorie',
        product: 'Produit',
        order: 'Commande',
        session: 'Session',
        system: 'Système'
    };

    const actions = ['login', 'logout', 'create', 'update', 'delete', 'status_change'];
    const entities = ['admin', 'category', 'product', 'order', 'session'];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <select
                    value={actionFilter}
                    onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
                    className={styles.filterSelect}
                >
                    <option value="">Toutes les actions</option>
                    {actions.map(a => (
                        <option key={a} value={a}>{actionLabels[a]}</option>
                    ))}
                </select>
                <select
                    value={entityFilter}
                    onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
                    className={styles.filterSelect}
                >
                    <option value="">Toutes les entités</option>
                    {entities.map(e => (
                        <option key={e} value={e}>{entityLabels[e]}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Chargement...</div>
            ) : logs.length === 0 ? (
                <div className={styles.empty}>
                    <p>Aucun log</p>
                </div>
            ) : (
                <>
                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span>Date/Heure</span>
                            <span>Admin</span>
                            <span>Action</span>
                            <span>Entité</span>
                            <span>Détails</span>
                        </div>
                        {logs.map((log) => (
                            <div key={log.id} className={styles.tableRow}>
                                <span className={styles.timestamp}>
                                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                                </span>
                                <span className={styles.admin}>{log.adminUsername}</span>
                                <span className={`${styles.action} ${styles[`action_${log.action}`]}`}>
                                    {actionLabels[log.action] || log.action}
                                </span>
                                <span className={styles.entity}>
                                    {entityLabels[log.entity] || log.entity}
                                    {log.entityId && <span className={styles.entityId}> #{log.entityId.slice(0, 8)}</span>}
                                </span>
                                <span className={styles.details}>{log.details || '-'}</span>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={styles.pageButton}
                            >
                                ← Précédent
                            </button>
                            <span className={styles.pageInfo}>
                                Page {page} sur {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={styles.pageButton}
                            >
                                Suivant →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
