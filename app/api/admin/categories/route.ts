import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { categoryService } from '@/lib/xml/CategoryService';
import { logService } from '@/lib/services/LogService';
import { verifyToken } from '@/lib/auth/AuthService';

// GET - Liste toutes les catégories (y compris inactives)
export async function GET() {
    try {
        const categories = await categoryService.getAll();
        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des catégories' },
            { status: 500 }
        );
    }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const payload = token ? await verifyToken(token) : null;

        const body = await request.json();
        const { slug, name, description, image, order } = body;

        if (!slug || !name) {
            return NextResponse.json(
                { success: false, error: 'Slug et nom requis' },
                { status: 400 }
            );
        }

        const newCategory = await categoryService.create({
            slug,
            name,
            description: description || '',
            image: image || '',
            order: parseInt(order || '0'),
            parentId: body.parentId || undefined
        });

        // Logger l'action
        if (payload) {
            await logService.log({
                adminId: payload.adminId,
                adminUsername: payload.username,
                action: 'create',
                entity: 'category',
                details: `Création de la catégorie: ${name}`
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Catégorie créée avec succès',
            data: newCategory
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la création de la catégorie' },
            { status: 500 }
        );
    }
}
