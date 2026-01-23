import { NextResponse } from 'next/server';
import { categoryService } from '@/lib/xml/CategoryService';

export async function GET() {
    try {
        const categories = await categoryService.getAll();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
