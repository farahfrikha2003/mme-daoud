import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { categoryService } from '@/lib/xml/CategoryService';
import { logService } from '@/lib/services/LogService';
import { verifyToken } from '@/lib/auth/AuthService';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const payload = token ? await verifyToken(token) : null;

        const body = await request.json();
        const { id } = params;

        const updated = await categoryService.update(id, body);

        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'Catégorie non trouvée' },
                { status: 404 }
            );
        }

        if (payload) {
            await logService.log({
                adminId: payload.adminId,
                adminUsername: payload.username,
                action: 'update',
                entity: 'category',
                details: `Mise à jour catégorie: ${updated.name}`
            });
        }

        return NextResponse.json({
            success: true,
            data: updated
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const payload = token ? await verifyToken(token) : null;

        const { id } = params;
        const success = await categoryService.delete(id);

        if (!success) {
            return NextResponse.json(
                { success: false, error: 'Catégorie non trouvée' },
                { status: 404 }
            );
        }

        if (payload) {
            await logService.log({
                adminId: payload.adminId,
                adminUsername: payload.username,
                action: 'delete',
                entity: 'category',
                details: `Suppression catégorie ID: ${id}`
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Catégorie supprimée'
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}
