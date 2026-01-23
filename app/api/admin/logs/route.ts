import { NextRequest, NextResponse } from 'next/server';
import { logService } from '@/lib/services/LogService';
import { LogFilters } from '@/lib/types/admin';

// GET - Liste les logs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const filters: LogFilters = {};
        if (searchParams.get('adminId')) filters.adminId = searchParams.get('adminId') || undefined;
        if (searchParams.get('action')) filters.action = searchParams.get('action') as LogFilters['action'];
        if (searchParams.get('entity')) filters.entity = searchParams.get('entity') as LogFilters['entity'];
        if (searchParams.get('dateFrom')) filters.dateFrom = searchParams.get('dateFrom') || undefined;
        if (searchParams.get('dateTo')) filters.dateTo = searchParams.get('dateTo') || undefined;

        const result = await logService.getPaginated(page, limit, filters);

        return NextResponse.json({
            success: true,
            data: result.items,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des logs' },
            { status: 500 }
        );
    }
}
