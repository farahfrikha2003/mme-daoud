import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { productService } from '@/lib/services/ProductService';
import { logService } from '@/lib/services/LogService';
import { verifyToken } from '@/lib/auth/AuthService';
import { requireAdminAuth } from '@/lib/auth/middleware';

// GET - Liste tous les produits
export async function GET(request: NextRequest) {
    const authResult = await requireAdminAuth(request);
    if (authResult.response) {
        return authResult.response;
    }
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        const products = await productService.getAll(includeInactive);

        return NextResponse.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des produits' },
            { status: 500 }
        );
    }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
    const authResult = await requireAdminAuth(request);
    if (authResult.response) {
        return authResult.response;
    }
    const payload = authResult.payload;
    
    try {

        const body = await request.json();

        // Valider les champs requis
        if (!body.slug || !body.name || !body.price || !body.categorySlug) {
            return NextResponse.json(
                { success: false, error: 'Champs requis manquants: slug, name, price, categorySlug' },
                { status: 400 }
            );
        }

        const product = await productService.create(body);

        // Logger l'action
        if (payload) {
            await logService.log({
                adminId: payload.adminId,
                adminUsername: payload.username,
                action: 'create',
                entity: 'product',
                entityId: product.id,
                details: `Création du produit: ${product.name}`
            });
        }

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Produit créé avec succès'
        });
    } catch (error) {
        console.error('Error creating product:', error);
        const message = error instanceof Error ? error.message : 'Erreur lors de la création du produit';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
