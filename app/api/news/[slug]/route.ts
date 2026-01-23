import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/lib/services/NewsService';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const article = await newsService.getBySlug(slug);

        if (!article) {
            return NextResponse.json({
                success: false,
                error: 'Article non trouvé'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error('Error fetching news article:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération de l\'article'
        }, { status: 500 });
    }
}
