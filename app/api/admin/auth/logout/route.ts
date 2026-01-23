import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authService, verifyToken } from '@/lib/auth/AuthService';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (token) {
            const payload = await verifyToken(token);
            if (payload) {
                await authService.logout(
                    payload.adminId,
                    payload.username,
                    request.headers.get('x-forwarded-for') || undefined
                );
            }
        }

        // Supprimer le cookie
        cookieStore.delete('admin_token');

        return NextResponse.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la déconnexion' },
            { status: 500 }
        );
    }
}
