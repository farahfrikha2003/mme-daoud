import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService } from '@/lib/auth/AuthService';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Identifiant et mot de passe requis' },
                { status: 400 }
            );
        }

        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        const result = await authService.login(username, password, ipAddress, userAgent);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Identifiants incorrects' },
                { status: 401 }
            );
        }

        // Créer la réponse avec le cookie
        const response = NextResponse.json({
            success: true,
            data: result.admin
        });

        // Définir le cookie HttpOnly
        const cookieStore = await cookies();
        cookieStore.set('admin_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 heures
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        const message = error instanceof Error ? error.message : 'Erreur lors de la connexion';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
