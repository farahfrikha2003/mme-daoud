import { NextResponse } from 'next/server';
import { newsService } from '@/lib/services/NewsService';

export async function GET() {
    try {
        const articles = await newsService.getAll();
        // Filtrer les articles actifs
        const activeArticles = articles.filter(a => a.isActive);
        // Trier par date décroissante
        activeArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({
            success: true,
            data: activeArticles
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération des actualités'
        }, { status: 500 });
    }
}
