import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/auth/AuthService';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const admin = await authService.verifySession(token);

        if (!admin) {
            cookieStore.delete('admin_token');
            return NextResponse.json(
                { success: false, error: 'Session invalide' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: admin
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur de vérification' },
            { status: 500 }
        );
    }
}
