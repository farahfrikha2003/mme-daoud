import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { NewsArticle } from '@/lib/types/news';

export class NewsService extends BaseXmlService {
    private filename = 'news.xml';

    async getAll(): Promise<NewsArticle[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const articleBlocks = this.extractAllTags(content, 'article');
        return articleBlocks.map(block => {
            const tagsBlock = this.extractTag(block, 'tags');
            const tags = tagsBlock ? this.extractAllTags(tagsBlock, 'tag') : [];

            return {
                id: this.extractTag(block, 'id'),
                slug: this.extractTag(block, 'slug'),
                title: this.extractTag(block, 'title'),
                excerpt: this.extractTag(block, 'excerpt'),
                content: this.extractTag(block, 'content'),
                image: this.extractTag(block, 'image'),
                date: this.extractTag(block, 'date'),
                author: this.extractTag(block, 'author'),
                category: this.extractTag(block, 'category'),
                isActive: this.extractTag(block, 'isActive') === 'true',
                tags
            };
        });
    }

    async getBySlug(slug: string): Promise<NewsArticle | null> {
        const articles = await this.getAll();
        return articles.find(a => a.slug === slug) || null;
    }

    async create(article: Omit<NewsArticle, 'id' | 'date' | 'isActive'>): Promise<NewsArticle> {
        const articles = await this.getAll();
        const newArticle: NewsArticle = {
            ...article,
            id: this.generateId(),
            date: this.getCurrentTimestamp(),
            isActive: true
        };

        articles.push(newArticle);
        await this.saveAll(articles);
        return newArticle;
    }

    async update(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
        const articles = await this.getAll();
        const index = articles.findIndex(a => a.id === id);
        if (index === -1) return null;

        articles[index] = {
            ...articles[index],
            ...updates,
            // Ne pas écraser l'ID
            id: articles[index].id
        };

        await this.saveAll(articles);
        return articles[index];
    }

    async delete(id: string): Promise<boolean> {
        const articles = await this.getAll();
        const initialLength = articles.length;
        const filtered = articles.filter(a => a.id !== id);

        if (filtered.length === initialLength) return false;

        await this.saveAll(filtered);
        return true;
    }

    private async saveAll(articles: NewsArticle[]): Promise<void> {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<news>\n';
        xml += articles.map(a => this.articleToXml(a)).join('\n');
        xml += '\n</news>';

        await this.writeXmlFile(this.filename, xml);
    }

    private articleToXml(article: NewsArticle): string {
        let xml = '  <article>\n';
        xml += `    ${this.createTag('id', article.id)}\n`;
        xml += `    ${this.createTag('slug', article.slug)}\n`;
        xml += `    ${this.createTag('title', article.title)}\n`;
        xml += `    ${this.createTag('excerpt', article.excerpt)}\n`;
        xml += `    ${this.createTag('content', article.content)}\n`;
        xml += `    ${this.createTag('image', article.image)}\n`;
        xml += `    ${this.createTag('date', article.date)}\n`;
        xml += `    ${this.createTag('author', article.author)}\n`;
        xml += `    ${this.createTag('category', article.category)}\n`;
        xml += `    ${this.createTag('isActive', article.isActive)}\n`;

        if (article.tags && article.tags.length > 0) {
            xml += '    <tags>\n';
            article.tags.forEach(tag => {
                xml += `      ${this.createTag('tag', tag)}\n`;
            });
            xml += '    </tags>\n';
        }

        xml += '  </article>';
        return xml;
    }
}

export const newsService = new NewsService();
