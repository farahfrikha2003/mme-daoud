import { NextRequest, NextResponse } from 'next/server';
import { customerService } from '@/lib/services/CustomerService';

export async function GET(req: NextRequest) {
    try {
        const id = req.cookies.get('customer_token')?.value;
        if (!id) {
            return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
        }

        const customer = await customerService.getById(id);
        if (!customer) {
            return NextResponse.json({ success: false, error: 'Client non trouvé' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: customer });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
    }
}
