import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { employeeService } from '@/lib/services/EmployeeService';
import { logService } from '@/lib/services/LogService';
import { verifyToken } from '@/lib/auth/AuthService';
import { requireAdminAuth } from '@/lib/auth/middleware';

// GET - Liste tous les employés
export async function GET(request: NextRequest) {
    const authResult = await requireAdminAuth(request);
    if (authResult.response) {
        return authResult.response;
    }
    try {
        const employees = await employeeService.getAll();

        return NextResponse.json({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des employés' },
            { status: 500 }
        );
    }
}

// POST - Créer un nouvel employé
export async function POST(request: NextRequest) {
    const authResult = await requireAdminAuth(request);
    if (authResult.response) {
        return authResult.response;
    }
    const authPayload = authResult.payload;
    
    try {

        const body = await request.json();

        // Valider les champs requis
        if (!body.lastName || !body.firstName || !body.cin) {
            return NextResponse.json(
                { success: false, error: 'Champs requis manquants: nom, prénom, CIN' },
                { status: 400 }
            );
        }

        const employee = await employeeService.create(body);

        // Logger l'action
        if (authPayload) {
            await logService.log({
                adminId: authPayload.adminId,
                adminUsername: authPayload.username,
                action: 'create',
                entity: 'employee',
                entityId: employee.id,
                details: `Création de l'employé: ${employee.firstName} ${employee.lastName}`
            });
        }

        return NextResponse.json({
            success: true,
            data: employee,
            message: 'Employé créé avec succès'
        });
    } catch (error) {
        console.error('Error creating employee:', error);
        const message = error instanceof Error ? error.message : 'Erreur lors de la création de l\'employé';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
