import { NextRequest, NextResponse } from 'next/server';
import { stockService } from '@/lib/services/StockService';
import { productService } from '@/lib/services/ProductService';
import { requireAdminAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const type = searchParams.get('type') as 'in' | 'out' | 'adjustment' | 'transfer' | null;
    const list = await stockService.getAll(productId, type || undefined);
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des mouvements de stock' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const body = await request.json();
    if (authResult.payload) body.createdBy = authResult.payload.adminId;
    if (body.productId && !body.productName) {
      const product = await productService.getById(body.productId);
      if (product) body.productName = product.name;
    }
    const mov = await stockService.create(body);
    return NextResponse.json({ success: true, data: mov });
  } catch (error) {
    console.error('Error creating stock movement:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement du mouvement' },
      { status: 500 }
    );
  }
}
