import { NextRequest, NextResponse } from 'next/server';
import { xmlStorage } from '@/lib/xml/XmlStorageService';
import { UpdateXmlDataRequest, XmlDataResponse } from '@/lib/xml/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/xml-data/[id] - Récupérer une donnée spécifique
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const data = await xmlStorage.getById(id);

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Donnée non trouvée' },
        { status: 404 }
      );
    }

    const response: XmlDataResponse = {
      success: true,
      data
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de la donnée XML:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération de la donnée' },
      { status: 500 }
    );
  }
}

// PUT /api/xml-data/[id] - Mettre à jour une donnée
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body: UpdateXmlDataRequest = await request.json();

    // Vérifier que la donnée existe
    const existing = await xmlStorage.getById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Donnée non trouvée' },
        { status: 404 }
      );
    }

    const updated = await xmlStorage.update(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    const response: XmlDataResponse = {
      success: true,
      data: updated,
      message: 'Donnée mise à jour avec succès'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la donnée XML:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la mise à jour de la donnée' },
      { status: 500 }
    );
  }
}

// DELETE /api/xml-data/[id] - Supprimer une donnée
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Vérifier que la donnée existe
    const existing = await xmlStorage.getById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Donnée non trouvée' },
        { status: 404 }
      );
    }

    const deleted = await xmlStorage.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    const response: XmlDataResponse = {
      success: true,
      message: 'Donnée supprimée avec succès'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la suppression de la donnée XML:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la suppression de la donnée' },
      { status: 500 }
    );
  }
}