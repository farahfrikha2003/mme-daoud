import { NextRequest, NextResponse } from 'next/server';
import { visitService } from '@/lib/services/VisitService';

export async function POST(req: NextRequest) {
    try {
        // Vérifier que le body est valide
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json(
                { success: false, error: 'Invalid JSON body' },
                { status: 400 }
            );
        }

        const { path } = body;
        
        // Valider que path existe et est une string
        if (!path || typeof path !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Path is required' },
                { status: 400 }
            );
        }

        // Ne pas tracker les pages admin ou les routes API
        if (path.startsWith('/admin') || path.startsWith('/api')) {
            return NextResponse.json({ success: true, skipped: true });
        }

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                  req.headers.get('x-real-ip') || 
                  'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        await visitService.logVisit(path, ip, userAgent);

        return NextResponse.json({ success: true });
    } catch (error) {
        // Ne pas exposer les détails de l'erreur en production
        console.error('Error tracking visit:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
