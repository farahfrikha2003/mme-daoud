import { BaseXmlService } from './BaseXmlService';
import { Category } from '../types/product';

class CategoryService extends BaseXmlService {
    private fileName = 'categories.xml';

    async getAll(): Promise<Category[]> {
        const content = await this.readXmlFile(this.fileName);
        if (!content) return [];

        const categories: Category[] = [];
        const regex = /<category>([\s\S]*?)<\/category>/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            const inner = match[1];
            const id = this.extractTag(inner, 'id');
            const slug = this.extractTag(inner, 'slug');
            const name = this.extractTag(inner, 'name');
            const parentId = this.extractTag(inner, 'parentId');
            const order = parseInt(this.extractTag(inner, 'order') || '0');

            if (id && slug && name) {
                categories.push({
                    id,
                    slug,
                    name,
                    description: '', // Not stored in XML currently
                    image: '', // Not stored in XML currently
                    order,
                    parentId: parentId || undefined
                });
            }
        }

        return categories.sort((a, b) => a.order - b.order);
    }

    async getById(id: string): Promise<Category | null> {
        const categories = await this.getAll();
        return categories.find(c => c.id === id) || null;
    }

    async create(category: Omit<Category, 'id'>): Promise<Category> {
        const categories = await this.getAll();

        // Generate new ID (max + 1 for simple numeric IDs used so far, or random)
        // Existing IDs seem to be numeric (101, 102, 1, etc). Let's try to keep it numeric if possible, else uuid.
        // Simple strategy: Math.max(...ids) + 1
        const maxId = categories.reduce((max, c) => Math.max(max, parseInt(c.id) || 0), 0);
        const newId = (maxId + 1).toString();

        const newCategory: Category = { ...category, id: newId };

        const xmlNode = this.categoryToXml(newCategory);
        let content = await this.readXmlFile(this.fileName);

        if (!content) {
            content = '<?xml version="1.0" encoding="UTF-8"?>\n<categories>\n</categories>';
        }

        // Insert before closing tag
        const closingTag = '</categories>';
        const insertIndex = content.lastIndexOf(closingTag);

        if (insertIndex === -1) {
            // Basic fallback
            content += `\n${xmlNode}`;
        } else {
            content = content.slice(0, insertIndex) + `  ${xmlNode}\n` + content.slice(insertIndex);
        }

        await this.writeXmlFile(this.fileName, content);
        return newCategory;
    }

    async update(id: string, updates: Partial<Category>): Promise<Category | null> {
        let content = await this.readXmlFile(this.fileName);
        if (!content) return null;

        const categories = await this.getAll();
        const existingIndex = categories.findIndex(c => c.id === id);
        if (existingIndex === -1) return null;

        const updatedCategory = { ...categories[existingIndex], ...updates };

        // We need to replace the specific <category> block that contains <id>ID</id>
        // Regex to find the block: <category>...<id>ID</id>...</category>
        // This is tricky with regex. Better to rebuild the file from objects to be safe.

        categories[existingIndex] = updatedCategory;
        await this.saveAll(categories);

        return updatedCategory;
    }

    async delete(id: string): Promise<boolean> {
        const categories = await this.getAll();
        const initialLength = categories.length;
        const filtered = categories.filter(c => c.id !== id);

        if (filtered.length === initialLength) return false;

        await this.saveAll(filtered);
        return true;
    }

    private async saveAll(categories: Category[]): Promise<void> {
        let content = '<?xml version="1.0" encoding="UTF-8"?>\n<categories>\n';

        // Sort by hierarchy/order? Or just list? 
        // Let's just list them, order is preserved in properties

        // Maybe group by comments like original file? Hard to preserve comments when rebuilding.
        // We will accept losing comments for now or try to be smarter.
        // Given complexity, rebuilding is safer for data integrity.

        categories.forEach(cat => {
            content += `  ${this.categoryToXml(cat)}\n`;
        });

        content += '</categories>';
        await this.writeXmlFile(this.fileName, content);
    }

    private categoryToXml(category: Category): string {
        let xml = '<category>\n';
        xml += `    ${this.createTag('id', category.id)}\n`;
        xml += `    ${this.createTag('slug', category.slug)}\n`;
        xml += `    ${this.createTag('name', category.name)}\n`;
        if (category.parentId) {
            xml += `    ${this.createTag('parentId', category.parentId)}\n`;
        }
        xml += `    ${this.createTag('order', category.order)}\n`;
        xml += '  </category>';
        return xml;
    }
}

export const categoryService = new CategoryService();
