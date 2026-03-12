import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/PaymentService';
import { requireAdminAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId') || undefined;
    const invoiceId = searchParams.get('invoiceId') || undefined;
    const list = await paymentService.getAll(orderId, invoiceId);
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des paiements' },
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
    const pay = await paymentService.create(body);
    return NextResponse.json({ success: true, data: pay });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement du paiement' },
      { status: 500 }
    );
  }
}
