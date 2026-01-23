import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { orderService } from '@/lib/services/OrderService';
import { logService } from '@/lib/services/LogService';
import { verifyToken } from '@/lib/auth/AuthService';
import { OrderStatus } from '@/lib/types/admin';

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET - Récupérer une commande
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const order = await orderService.getById(id);

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Commande non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération de la commande' },
            { status: 500 }
        );
    }
}

// PATCH - Changer le statut d'une commande
export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const payload = token ? await verifyToken(token) : null;

        const body = await request.json();
        const { status, note } = body;

        if (!status) {
            return NextResponse.json(
                { success: false, error: 'Statut requis' },
                { status: 400 }
            );
        }

        const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Statut invalide' },
                { status: 400 }
            );
        }

        const order = await orderService.updateStatus(
            id,
            status,
            payload?.adminId,
            note
        );

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Commande non trouvée' },
                { status: 404 }
            );
        }

        // Logger l'action
        if (payload) {
            await logService.log({
                adminId: payload.adminId,
                adminUsername: payload.username,
                action: 'status_change',
                entity: 'order',
                entityId: id,
                details: `Changement de statut: ${status} - ${order.orderNumber}`
            });
        }

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Statut de la commande mis à jour'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la mise à jour du statut' },
            { status: 500 }
        );
    }
}
