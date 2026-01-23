import { NextRequest, NextResponse } from 'next/server';
import { customerService } from '@/lib/services/CustomerService';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const customer = await customerService.register(body);

        // Créer une réponse
        const response = NextResponse.json({ success: true, data: customer });

        // Simuler un cookie de session
        response.cookies.set('customer_token', customer.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 semaine
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
