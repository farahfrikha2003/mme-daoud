import { NextRequest, NextResponse } from 'next/server';
import { supplierService } from '@/lib/services/SupplierService';
import { requireAdminAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const list = await supplierService.getAll(activeOnly);
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des fournisseurs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const body = await request.json();
    const sup = await supplierService.create(body);
    return NextResponse.json({ success: true, data: sup });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du fournisseur' },
      { status: 500 }
    );
  }
}
