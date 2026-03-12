import { NextRequest, NextResponse } from 'next/server';
import { invoiceService } from '@/lib/services/InvoiceService';
import { requireAdminAuth } from '@/lib/auth/middleware';
import { InvoiceStatus } from '@/lib/types/invoice';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as InvoiceStatus | null;
    const list = await invoiceService.getAll(status || undefined);
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const body = await request.json();
    const inv = await invoiceService.create(body);
    return NextResponse.json({ success: true, data: inv });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
}
