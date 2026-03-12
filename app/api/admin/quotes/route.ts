import { NextRequest, NextResponse } from 'next/server';
import { quoteService } from '@/lib/services/QuoteService';
import { requireAdminAuth } from '@/lib/auth/middleware';
import { QuoteStatus } from '@/lib/types/quote';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as QuoteStatus | null;
    const list = await quoteService.getAll(status || undefined);
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des devis' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const body = await request.json();
    const quote = await quoteService.create(body);
    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du devis' },
      { status: 500 }
    );
  }
}
