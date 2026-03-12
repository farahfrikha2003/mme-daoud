import { NextRequest, NextResponse } from 'next/server';
import { adminService } from '@/lib/services/AdminXmlService';
import { requireAdminAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request);
  if (authResult.response) return authResult.response;
  try {
    const users = await adminService.getAll();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}
