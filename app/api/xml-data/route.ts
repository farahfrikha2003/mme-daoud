import { NextRequest, NextResponse } from 'next/server';
import { xmlStorage } from '@/lib/xml/XmlStorageService';
import { CreateXmlDataRequest, UpdateXmlDataRequest, XmlDataResponse, XmlDataListResponse } from '@/lib/xml/types';

// GET /api/xml-data - Récupérer toutes les données
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let data;

    if (search) {
      // Recherche avec query
      data = await xmlStorage.search(search);
    } else {
      // Récupération de toutes les données
      data = await xmlStorage.getAll();
    }

    // Appliquer la pagination si spécifiée
    if (limit) {
      const limitNum = parseInt(limit);
      const offsetNum = parseInt(offset || '0');
      data = data.slice(offsetNum, offsetNum + limitNum);
    }

    const response: XmlDataListResponse = {
      success: true,
      data,
      total: data.length
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des données XML:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

// POST /api/xml-data - Créer une nouvelle donnée
export async function POST(request: NextRequest) {
  try {
    const body: CreateXmlDataRequest = await request.json();

    // Validation basique
    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, message: 'Le titre et la description sont requis' },
        { status: 400 }
      );
    }

    const newItem = await xmlStorage.save({
      ...body
    });

    const response: XmlDataResponse = {
      success: true,
      data: newItem,
      message: 'Donnée créée avec succès'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la donnée XML:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la création de la donnée' },
      { status: 500 }
    );
  }
}