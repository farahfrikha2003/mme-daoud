import { NextRequest, NextResponse } from 'next/server';
import { customerService } from '@/lib/services/CustomerService';

export async function GET() {
    try {
        const customers = await customerService.getAll();
        // Return without passwords
        const safeCustomers = customers.map(c => {
            const { passwordHash, ...safe } = c;
            return safe;
        });
        return NextResponse.json({ success: true, data: safeCustomers });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erreur lors de la récupération' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

        const success = await customerService.delete(id);
        return NextResponse.json({ success });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erreur lors de la suppression' }, { status: 500 });
    }
}
