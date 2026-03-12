import { NextRequest, NextResponse } from 'next/server';
import { invoiceService } from '@/lib/services/InvoiceService';
import { requireAdminAuth } from '@/lib/auth/middleware';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const inv = await invoiceService.getById(id);
    if (!inv) return NextResponse.json({ success: false, error: 'Facture non trouvée' }, { status: 404 });
    return NextResponse.json({ success: true, data: inv });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const body = await request.json();
    const inv = await invoiceService.update(id, body);
    if (!inv) return NextResponse.json({ success: false, error: 'Facture non trouvée' }, { status: 404 });
    return NextResponse.json({ success: true, data: inv });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
