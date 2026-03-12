import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/services/OrderService';
import { invoiceService } from '@/lib/services/InvoiceService';
import { paymentService } from '@/lib/services/PaymentService';
import { stockService } from '@/lib/services/StockService';
import { requireAdminAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'sales';

    if (type === 'sales') {
      const [orders, invoices, payments] = await Promise.all([
        orderService.getAll(),
        invoiceService.getAll(),
        paymentService.getAll(),
      ]);
      const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
      const totalInvoiced = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
      const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
      return NextResponse.json({
        success: true,
        data: {
          totalOrders: orders.length,
          totalRevenue,
          totalInvoices: invoices.length,
          totalInvoiced,
          totalPayments: payments.length,
          totalPaid,
          byStatus: orders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      });
    }

    if (type === 'stock') {
      const movements = await stockService.getAll();
      const byType = movements.reduce((acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return NextResponse.json({
        success: true,
        data: {
          totalMovements: movements.length,
          byType,
          recent: movements.slice(0, 50),
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Type de rapport inconnu' }, { status: 400 });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la génération du rapport' },
      { status: 500 }
    );
  }
}
