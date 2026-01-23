import { NextRequest, NextResponse } from 'next/server';
import { customerService } from '@/lib/services/CustomerService';

export async function POST(req: NextRequest) {
    try {
        const { identifier, password } = await req.json();

        // On récupère tous les clients pour chercher par email/username
        const customers = await customerService.getAll();
        const customer = customers.find(c =>
            (c.email.toLowerCase() === identifier.toLowerCase() || c.username === identifier) &&
            c.passwordHash === password // Pour la démo, comparaison directe
        );

        if (!customer) {
            return NextResponse.json({ success: false, error: 'Identifiants invalides' }, { status: 401 });
        }

        // Mettre à jour lastLogin
        await customerService.update(customer.id, { lastLogin: new Date().toISOString() });

        const { passwordHash, ...safeCustomer } = customer;
        const response = NextResponse.json({ success: true, data: safeCustomer });

        response.cookies.set('customer_token', customer.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ success: false, error: 'Erreur lors de la connexion' }, { status: 500 });
    }
}
