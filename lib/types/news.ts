export interface NewsArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    date: string;
    author: string;
    category: string;
    isActive: boolean;
    tags?: string[];
}

export interface CreateNewsInput {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    isActive?: boolean;
    tags?: string[];
}
