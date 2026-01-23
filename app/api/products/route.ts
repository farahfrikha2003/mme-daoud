import { NextResponse } from 'next/server';
import { productService } from '@/lib/services/ProductService';

export async function GET() {
    try {
        const products = await productService.getAll();
        // Filter only active products for public view
        const activeProducts = products.filter(p => p.isActive);

        return NextResponse.json({
            success: true,
            data: activeProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des produits' },
            { status: 500 }
        );
    }
}
