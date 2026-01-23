import { NextRequest, NextResponse } from 'next/server';
import { visitService } from '@/lib/services/VisitService';

export async function POST(req: NextRequest) {
    try {
        const { path } = await req.json();
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        await visitService.logVisit(path, ip, userAgent);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
