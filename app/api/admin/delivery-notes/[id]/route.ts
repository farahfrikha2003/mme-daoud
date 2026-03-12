import { NextRequest, NextResponse } from 'next/server';
import { deliveryNoteService } from '@/lib/services/DeliveryNoteService';
import { requireAdminAuth } from '@/lib/auth/middleware';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const dn = await deliveryNoteService.getById(id);
    if (!dn) return NextResponse.json({ success: false, error: 'Bon de livraison non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: dn });
  } catch (error) {
    console.error('Error fetching delivery note:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const body = await request.json();
    const dn = await deliveryNoteService.update(id, body);
    if (!dn) return NextResponse.json({ success: false, error: 'Bon de livraison non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: dn });
  } catch (error) {
    console.error('Error updating delivery note:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
