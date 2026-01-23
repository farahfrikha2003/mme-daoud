import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from './AuthService';

/**
 * Helper function to check admin authentication for API routes
 * Returns the admin payload if authenticated, or null if not
 */
export async function requireAdminAuth(request: NextRequest): Promise<{
    payload: Awaited<ReturnType<typeof verifyToken>>;
    response: null;
} | {
    payload: null;
    response: NextResponse;
}> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
        return {
            payload: null,
            response: NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            )
        };
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return {
            payload: null,
            response: NextResponse.json(
                { success: false, error: 'Token invalide ou expiré' },
                { status: 401 }
            )
        };
    }

    return { payload, response: null };
}

/**
 * Helper function to check if admin token is valid (for page routes)
 * Returns the payload if valid, or null if not
 */
export async function checkAdminAuth(): Promise<Awaited<ReturnType<typeof verifyToken>> | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
        return null;
    }

    return await verifyToken(token);
}
