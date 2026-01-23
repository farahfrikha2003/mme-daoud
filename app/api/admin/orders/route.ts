import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/services/OrderService';
import { OrderFilters } from '@/lib/types/admin';
import { requireAdminAuth } from '@/lib/auth/middleware';

// GET - Liste toutes les commandes
export async function GET(request: NextRequest) {
    const authResult = await requireAdminAuth(request);
    if (authResult.response) {
        return authResult.response;
    }
    try {
        const { searchParams } = new URL(request.url);

        const filters: OrderFilters = {};
        if (searchParams.get('status')) filters.status = searchParams.get('status') as OrderFilters['status'];
        if (searchParams.get('search')) filters.search = searchParams.get('search') || undefined;
        if (searchParams.get('dateFrom')) filters.dateFrom = searchParams.get('dateFrom') || undefined;
        if (searchParams.get('dateTo')) filters.dateTo = searchParams.get('dateTo') || undefined;

        const orders = await orderService.getAll(filters);

        return NextResponse.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des commandes' },
            { status: 500 }
        );
    }
}
