import { NextRequest, NextResponse } from 'next/server';
import { deliveryNoteService } from '@/lib/services/DeliveryNoteService';
import { requireAdminAuth } from '@/lib/auth/middleware';
import { DeliveryNoteStatus } from '@/lib/types/deliveryNote';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as DeliveryNoteStatus | null;
    const list = await deliveryNoteService.getAll(status || undefined);
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching delivery notes:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des bons de livraison' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const body = await request.json();
    const dn = await deliveryNoteService.create(body);
    return NextResponse.json({ success: true, data: dn });
  } catch (error) {
    console.error('Error creating delivery note:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du bon de livraison' },
      { status: 500 }
    );
  }
}
