import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/lib/services/ProductService';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;
        const product = await productService.getBySlug(slug);

        if (!product || !product.isActive) {
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
