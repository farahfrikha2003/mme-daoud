import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/lib/services/NewsService';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newArticle = await newsService.create(body);
        return NextResponse.json({ success: true, data: newArticle });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erreur lors de la création' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;
        const updated = await newsService.update(id, updates);
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

        const success = await newsService.delete(id);
        return NextResponse.json({ success });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erreur lors de la suppression' }, { status: 500 });
    }
}
