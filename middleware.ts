import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Routes admin protégées (sauf login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Vérification basique du token (la vérification complète se fait côté API)
        try {
            // Décoder le token pour vérifier l'expiration
            const parts = token.split('.');
            if (parts.length === 3) {
                // JWT format
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    // Token expiré
                    const loginUrl = new URL('/admin/login', request.url);
                    loginUrl.searchParams.set('expired', 'true');
                    const response = NextResponse.redirect(loginUrl);
                    response.cookies.delete('admin_token');
                    return response;
                }
            } else {
                // Fallback format (base64)
                const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
                if (payload.exp && payload.exp < Date.now()) {
                    const loginUrl = new URL('/admin/login', request.url);
                    loginUrl.searchParams.set('expired', 'true');
                    const response = NextResponse.redirect(loginUrl);
                    response.cookies.delete('admin_token');
                    return response;
                }
            }
        } catch {
            // Token invalide
            const loginUrl = new URL('/admin/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('admin_token');
            return response;
        }
    }

    // API routes admin protégées
    if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*']
};
