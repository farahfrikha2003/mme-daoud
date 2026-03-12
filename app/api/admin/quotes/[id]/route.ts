import { NextRequest, NextResponse } from 'next/server';
import { quoteService } from '@/lib/services/QuoteService';
import { requireAdminAuth } from '@/lib/auth/middleware';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const quote = await quoteService.getById(id);
    if (!quote) return NextResponse.json({ success: false, error: 'Devis non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { id } = await context.params;
    const body = await request.json();
    const quote = await quoteService.update(id, body);
    if (!quote) return NextResponse.json({ success: false, error: 'Devis non trouvé' }, { status: 404 });
    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
