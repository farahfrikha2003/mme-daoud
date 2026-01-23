import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { productService } from '@/lib/services/ProductService';
import { logService } from '@/lib/services/LogService';
import { verifyToken } from '@/lib/auth/AuthService';

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET - Récupérer un produit
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const product = await productService.getById(id);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Produit non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération du produit' },
            { status: 500 }
        );
    }
}

// PUT - Mettre à jour un produit
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const payload = token ? await verifyToken(token) : null;

        const body = await request.json();

        const product = await productService.update(id, body);

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Produit non trouvé' },
                { status: 404 }
            );
        }

        // Logger l'action
        if (payload) {
            await logService.log({
                adminId: payload.adminId,
                adminUsername: payload.username,
                action: 'update',
                entity: 'product',
                entityId: id,
                details: `Mise à jour du produit: ${product.name}`
            });
        }

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Produit mis à jour avec succès'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du produit';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer un produit
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const payload = token ? await verifyToken(token) : null;

        // Récupérer le nom avant suppression pour le log
        const product = await productService.getById(id);
        const productName = product?.name || id;

        const success = await productService.delete(id);

        if (!success) {
            return NextResponse.json(
                { success: false, error: 'Produit non trouvé' },
                { status: 404 }
            );
        }

        // Logger l'action
        if (payload) {
            await logService.log({
                adminId: payload.adminId,
                adminUsername: payload.username,
                action: 'delete',
                entity: 'product',
                entityId: id,
                details: `Suppression du produit: ${productName}`
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Produit supprimé avec succès'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la suppression du produit' },
            { status: 500 }
        );
    }
}
