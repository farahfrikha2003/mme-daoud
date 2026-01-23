import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/services/ProductService';
import { orderService } from '@/lib/services/OrderService';
import { categoryService } from '@/lib/xml/CategoryService';
import { employeeService } from '@/lib/services/EmployeeService';
import { visitService } from '@/lib/services/VisitService';
import { requireAdminAuth } from '@/lib/auth/middleware';

// GET - Statistiques du dashboard
export async function GET(request: NextRequest) {
    const authResult = await requireAdminAuth(request);
    if (authResult.response) {
        return authResult.response;
    }
    try {
        // Récupérer les données
        const [products, categories, orderStats, employees, allOrders, visitStats] = await Promise.all([
            productService.getAll(true),
            categoryService.getAll(),
            orderService.getStats(),
            employeeService.getAll(),
            orderService.getAll(),
            visitService.getStats()
        ]);

        // Calculer l'historique des revenus (7 derniers jours)
        const revenueHistory = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            const dayRevenue = allOrders
                .filter(o => o.createdAt.startsWith(dateString) && o.status !== 'cancelled')
                .reduce((sum, o) => sum + o.total, 0);

            revenueHistory.push({
                date: dateString,
                label: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
                revenue: dayRevenue
            });
        }

        // Récupérer les produits les plus commandés
        // Agrégation réelle à partir des commandes
        const productCounts: Record<string, { name: string, count: number }> = {};
        allOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productCounts[item.productId]) {
                    productCounts[item.productId] = { name: item.productName, count: 0 };
                }
                productCounts[item.productId].count += item.quantity;
            });
        });

        const topProducts = Object.entries(productCounts)
            .map(([id, info]) => ({
                productId: id,
                productName: info.name,
                count: info.count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return NextResponse.json({
            success: true,
            data: {
                totalProducts: products.length,
                activeProducts: products.filter(p => p.isActive).length,
                totalCategories: categories.length,
                totalEmployees: employees.length,
                visitStats,
                orderStats: {
                    ...orderStats,
                    averageOrderValue: orderStats.total > 0 ? orderStats.totalRevenue / (orderStats.total - orderStats.cancelled) : 0
                },
                recentOrders: allOrders.slice(0, 5),
                revenueHistory,
                topProducts
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des statistiques' },
            { status: 500 }
        );
    }
}
