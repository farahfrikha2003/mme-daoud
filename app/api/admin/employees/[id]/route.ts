import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { employeeService } from '@/lib/services/EmployeeService';
import { logService } from '@/lib/services/LogService';
import { verifyToken } from '@/lib/auth/AuthService';

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET - Récupérer un employé
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const employee = await employeeService.getById(id);

        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employé non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération de l\'employé' },
            { status: 500 }
        );
    }
}

// PUT - Mettre à jour un employé
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const authPayload = token ? await verifyToken(token) : null;

        const body = await request.json();
        const employee = await employeeService.update(id, body);

        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employé non trouvé' },
                { status: 404 }
            );
        }

        // Logger l'action
        if (authPayload) {
            await logService.log({
                adminId: authPayload.adminId,
                adminUsername: authPayload.username,
                action: 'update',
                entity: 'employee',
                entityId: id,
                details: `Mise à jour de l'employé: ${employee.firstName} ${employee.lastName}`
            });
        }

        return NextResponse.json({
            success: true,
            data: employee,
            message: 'Employé mis à jour avec succès'
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'employé';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer un employé
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const authPayload = token ? await verifyToken(token) : null;

        // Récupérer le nom avant suppression pour le log
        const employee = await employeeService.getById(id);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : id;

        const success = await employeeService.delete(id);

        if (!success) {
            return NextResponse.json(
                { success: false, error: 'Employé non trouvé' },
                { status: 404 }
            );
        }

        // Logger l'action
        if (authPayload) {
            await logService.log({
                adminId: authPayload.adminId,
                adminUsername: authPayload.username,
                action: 'delete',
                entity: 'employee',
                entityId: id,
                details: `Suppression de l'employé: ${employeeName}`
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Employé supprimé avec succès'
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la suppression de l\'employé' },
            { status: 500 }
        );
    }
}
