import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth/AuthService';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        // Authentification
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        const payload = token ? await verifyToken(token) : null;

        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'Aucun fichier fourni' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Créer le dossier s'il n'existe pas
        const uploadDir = path.join(process.cwd(), 'public/uploads/products');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if it exists
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeName}`;
        const filepath = path.join(uploadDir, filename);

        // Écrire le fichier
        await writeFile(filepath, buffer);

        // Retourner l'URL relative
        const url = `/uploads/products/${filename}`;

        return NextResponse.json({
            success: true,
            url,
            message: 'Image téléchargée avec succès'
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors du téléchargement de l\'image' },
            { status: 500 }
        );
    }
}
