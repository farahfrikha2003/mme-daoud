"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import {
    ShoppingBag,
    Users,
    TrendingUp,
    Package,
    Timer,
    DollarSign,
    ChevronRight,
    ArrowUpRight,
    Search,
    Plus,
    Eye,
    Percent,
    RefreshCw
} from 'lucide-react';

interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalEmployees: number;
    visitStats: {
        total: number;
        today: number;
        last7Days: number[];
    };
    orderStats: {
        total: number;
        pending: number;
        confirmed: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        totalRevenue: number;
        averageOrderValue: number;
    };
    recentOrders: Array<{
        id: string;
        orderNumber: string;
        status: string;
        total: number;
        customer: { firstName: string; lastName: string };
        createdAt: string;
    }>;
    revenueHistory: Array<{
        date: string;
        label: string;
        revenue: number;
    }>;
    topProducts: Array<{
        productId: string;
        productName: string;
        count: number;
    }>;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                const data = await response.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.expertSpinner}></div>
                <p>Analyse des performances...</p>
            </div>
        );
    }

    const conversionRate = stats && stats.visitStats.total > 0
        ? ((stats.orderStats.total / stats.visitStats.total) * 100).toFixed(1)
        : "0.0";

    const statusLabels: Record<string, string> = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        processing: 'En préparation',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée'
    };

    // Calculer le revenu maximum et visites maximum pour le graphique
    const maxRevenue = stats ? Math.max(...stats.revenueHistory.map(h => h.revenue), 100) : 100;
    const maxVisits = stats ? Math.max(...stats.visitStats.last7Days, 100) : 100;

    return (
        <div className={styles.page}>
            {/* Top Bar Insights */}
            <div className={styles.welcomeHeader}>
                <div>
                    <h1 className={styles.mainTitle}>Tableau de Bord</h1>
                    <p className={styles.subtitle}>Analyses avancées et suivi d'activité</p>
                </div>
                <div className={styles.headerActions}>
                    <button onClick={() => window.location.reload()} className={styles.secondaryAction}>
                        <RefreshCw size={16} /> Actualiser
                    </button>
                    <Link href="/admin/products/new" className={styles.primaryAction}>
                        <Plus size={18} /> Nouveau Produit
                    </Link>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className={styles.statsGrid}>
                <MetricCard
                    label="Revenu Total"
                    value={`${(stats?.orderStats.totalRevenue || 0).toFixed(2)} DT`}
                    icon={<DollarSign size={24} />}
                    trend="+12.5%"
                    color="var(--color-primary-gold)"
                />
                <MetricCard
                    label="Visiteurs"
                    value={stats?.visitStats.total || 0}
                    icon={<Eye size={24} />}
                    subValue={`${stats?.visitStats.today || 0} aujourd'hui`}
                    color="#4F46E5"
                />
                <MetricCard
                    label="Taux Conv."
                    value={`${conversionRate}%`}
                    icon={<Percent size={24} />}
                    trend="+2.1%"
                    color="#10B981"
                />
                <MetricCard
                    label="Équipe Personnel"
                    value={stats?.totalEmployees || 0}
                    icon={<Users size={24} />}
                    color="var(--color-primary-brown)"
                />
            </div>

            <div className={styles.dashboardGrid}>
                {/* Left Column: Visuals */}
                <div className={styles.mainPanel}>
                    {/* Revenue & Visits Chart */}
                    <div className={styles.chartCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Performance Dynamique</h3>
                            <div className={styles.cardMeta}>
                                <div className={styles.legendItem}>
                                    <span className={styles.dotGold}></span> Revenus
                                </div>
                                <div className={styles.legendItem}>
                                    <span className={styles.dotBlue}></span> Visites
                                </div>
                            </div>
                        </div>
                        <div className={styles.chartContainer}>
                            <div className={styles.chartBars}>
                                {stats?.revenueHistory.map((day, i) => (
                                    <div key={i} className={styles.barGroup}>
                                        <div className={styles.dualBars}>
                                            <div
                                                className={styles.barRevenue}
                                                style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                                                data-value={`${day.revenue.toFixed(2)} DT`}
                                            ></div>
                                            <div
                                                className={styles.barVisits}
                                                style={{ height: `${(stats.visitStats.last7Days[i] / maxVisits) * 100}%` }}
                                                data-value={`${stats.visitStats.last7Days[i]} visites`}
                                            ></div>
                                        </div>
                                        <span className={styles.barLabel}>{day.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className={styles.sectionCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Dernières Commandes</h3>
                            <Link href="/admin/orders" className={styles.textLink}>Voir tout <ChevronRight size={16} /></Link>
                        </div>
                        <div className={styles.ordersList}>
                            {stats?.recentOrders.map((order) => (
                                <Link key={order.id} href={`/admin/orders/${order.id}`} className={styles.orderRow}>
                                    <div className={styles.orderLeft}>
                                        <div className={styles.orderIcon}>
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <div className={styles.orderNumber}>{order.orderNumber}</div>
                                            <div className={styles.orderCustomer}>{order.customer.firstName} {order.customer.lastName}</div>
                                        </div>
                                    </div>
                                    <div className={styles.orderCenter}>
                                        <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>
                                            {statusLabels[order.status] || order.status}
                                        </span>
                                    </div>
                                    <div className={styles.orderRight}>
                                        <div className={styles.orderAmount}>{order.total.toFixed(2)} DT</div>
                                        <div className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Insights */}
                <div className={styles.sidePanel}>
                    {/* Top Products */}
                    <div className={styles.sectionCard}>
                        <h3 className={styles.cardTitle}>Meilleures Ventes</h3>
                        <div className={styles.topProductsList}>
                            {stats?.topProducts.map((product, i) => (
                                <div key={product.productId} className={styles.topProductItem}>
                                    <div className={styles.topProductInfo}>
                                        <span className={styles.productRank}>#0{i + 1}</span>
                                        <span className={styles.productName}>{product.productName}</span>
                                    </div>
                                    <div className={styles.productStats}>
                                        <span className={styles.productCount}>{product.count} ventes</span>
                                        <div className={styles.progressBackground}>
                                            <div
                                                className={styles.progressBar}
                                                style={{ width: `${(product.count / (stats.topProducts[0]?.count || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access List */}
                    <div className={styles.sectionCard}>
                        <h3 className={styles.cardTitle}>Navigation Rapide</h3>
                        <div className={styles.quickAccess}>
                            <Link href="/admin/categories" className={styles.accessItem}>
                                <div className={styles.accessIcon}><Package size={20} /></div>
                                <span>Inventaire & Catégories</span>
                                <ArrowUpRight size={16} className={styles.accessArrow} />
                            </Link>
                            <Link href="/admin/employees" className={styles.accessItem}>
                                <div className={styles.accessIcon}><Users size={20} /></div>
                                <span>Gestion de l'Équipe</span>
                                <ArrowUpRight size={16} className={styles.accessArrow} />
                            </Link>
                            <Link href="/admin/logs" className={styles.accessItem}>
                                <div className={styles.accessIcon}><Timer size={20} /></div>
                                <span>Journal d'Activité</span>
                                <ArrowUpRight size={16} className={styles.accessArrow} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend, subValue, color }: { label: string, value: string | number, icon: React.ReactNode, trend?: string, subValue?: string, color: string }) {
    return (
        <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
                <div className={styles.metricIcon} style={{ color }}>{icon}</div>
                {trend && <span className={styles.trendBadge}>{trend}</span>}
            </div>
            <div className={styles.metricContent}>
                <div className={styles.metricValue}>{value}</div>
                <div className={styles.metricLabel}>{label}</div>
                {subValue && <div className={styles.metricSub}>{subValue}</div>}
            </div>
        </div>
    );
}
