import { NextRequest, NextResponse } from 'next/server';
import { supplierService } from '@/lib/services/SupplierService';
import { requireAdminAuth } from '@/lib/auth/middleware';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const sup = await supplierService.getById(id);
    if (!sup) return NextResponse.json({ success: false, error: 'Fournisseur non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: sup });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const body = await request.json();
    const sup = await supplierService.update(id, body);
    if (!sup) return NextResponse.json({ success: false, error: 'Fournisseur non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: sup });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
