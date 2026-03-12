import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/PaymentService';
import { requireAdminAuth } from '@/lib/auth/middleware';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const pay = await paymentService.getById(id);
    if (!pay) return NextResponse.json({ success: false, error: 'Paiement non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: pay });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const body = await request.json();
    const pay = await paymentService.update(id, body);
    if (!pay) return NextResponse.json({ success: false, error: 'Paiement non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: pay });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
