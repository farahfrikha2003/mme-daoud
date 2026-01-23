import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Product } from '@/lib/types/product';

export interface CreateProductInput {
    slug: string;
    name: string;
    description: string;
    composition: string;
    conservation: string;
    price: number;
    priceUnit?: string;
    category: string;
    categorySlug: string;
    images?: string[];
    isNew?: boolean;
    isPromo?: boolean;
    promoPrice?: number;
    isFeatured?: boolean;
    isGlutenFree?: boolean;
    piecesPerHundredGrams?: number;
    minQuantity?: number;
    stock?: 'in_stock' | 'low_stock' | 'out_of_stock';
    stockQuantity?: number;
    recipe?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    isActive?: boolean;
}

export interface ProductWithActive extends Product {
    isActive: boolean;
    stockQuantity?: number;
}

/**
 * Service de gestion des produits en XML
 */
export class ProductService extends BaseXmlService {
    private filename = 'products.xml';

    /**
     * Récupère tous les produits
     */
    async getAll(includeInactive: boolean = false): Promise<ProductWithActive[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const productBlocks = this.extractAllTags(content, 'product');
        let products = productBlocks.map(block => this.parseProduct(block)).filter(p => p !== null) as ProductWithActive[];

        if (!includeInactive) {
            products = products.filter(p => p.isActive);
        }

        return products;
    }

    /**
     * Récupère un produit par ID
     */
    async getById(id: string): Promise<ProductWithActive | null> {
        const products = await this.getAll(true);
        return products.find(p => p.id === id) || null;
    }

    /**
     * Récupère un produit par slug
     */
    async getBySlug(slug: string): Promise<ProductWithActive | null> {
        const products = await this.getAll(true);
        return products.find(p => p.slug === slug) || null;
    }

    /**
     * Crée un nouveau produit
     */
    async create(input: CreateProductInput): Promise<ProductWithActive> {
        const products = await this.getAll(true);

        // Vérifier l'unicité du slug
        if (products.some(p => p.slug === input.slug)) {
            throw new Error('Ce slug existe déjà');
        }

        const now = this.getCurrentTimestamp();
        const newProduct: ProductWithActive = {
            id: this.generateId(),
            slug: input.slug,
            name: input.name,
            description: input.description,
            composition: input.composition,
            conservation: input.conservation,
            price: input.price,
            priceUnit: input.priceUnit || '100g',
            category: input.category,
            categorySlug: input.categorySlug,
            images: input.images || [],
            isNew: input.isNew || false,
            isPromo: input.isPromo || false,
            promoPrice: input.promoPrice,
            isFeatured: input.isFeatured || false,
            isGlutenFree: input.isGlutenFree || false,
            isActive: true,
            piecesPerHundredGrams: input.piecesPerHundredGrams || 5,
            minQuantity: input.minQuantity || 100,
            stock: input.stock || 'in_stock',
            stockQuantity: input.stockQuantity,
            recipe: input.recipe,
            createdAt: now,
            updatedAt: now
        };

        products.push(newProduct);
        await this.saveAll(products);

        return newProduct;
    }

    /**
     * Met à jour un produit
     */
    async update(id: string, input: UpdateProductInput): Promise<ProductWithActive | null> {
        const products = await this.getAll(true);
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        // Vérifier l'unicité du slug si changement
        if (input.slug && input.slug !== products[index].slug) {
            if (products.some(p => p.slug === input.slug && p.id !== id)) {
                throw new Error('Ce slug existe déjà');
            }
        }

        const updated: ProductWithActive = {
            ...products[index],
            ...input,
            updatedAt: this.getCurrentTimestamp()
        };

        products[index] = updated;
        await this.saveAll(products);

        return updated;
    }

    /**
     * Supprime un produit
     */
    async delete(id: string): Promise<boolean> {
        const products = await this.getAll(true);
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return false;

        products.splice(index, 1);
        await this.saveAll(products);

        return true;
    }

    /**
     * Ajoute des images à un produit
     */
    async addImages(id: string, imagePaths: string[]): Promise<ProductWithActive | null> {
        const products = await this.getAll(true);
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        products[index].images = [...products[index].images, ...imagePaths];
        products[index].updatedAt = this.getCurrentTimestamp();
        await this.saveAll(products);

        return products[index];
    }

    /**
     * Supprime une image d'un produit
     */
    async removeImage(id: string, imagePath: string): Promise<ProductWithActive | null> {
        const products = await this.getAll(true);
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        products[index].images = products[index].images.filter(img => img !== imagePath);
        products[index].updatedAt = this.getCurrentTimestamp();
        await this.saveAll(products);

        return products[index];
    }

    /**
     * Parse un bloc XML produit
     */
    private parseProduct(xml: string): ProductWithActive | null {
        const id = this.extractTag(xml, 'id');
        if (!id) return null;

        // Parse images
        const imagesBlock = xml.match(/<images>([\s\S]*?)<\/images>/);
        let images: string[] = [];
        if (imagesBlock) {
            images = this.extractAllTags(imagesBlock[1], 'image');
        }

        return {
            id,
            slug: this.extractTag(xml, 'slug'),
            name: this.extractTag(xml, 'name'),
            description: this.extractTag(xml, 'description'),
            composition: this.extractTag(xml, 'composition'),
            conservation: this.extractTag(xml, 'conservation'),
            price: parseFloat(this.extractTag(xml, 'price')) || 0,
            priceUnit: this.extractTag(xml, 'priceUnit') || '100g',
            category: this.extractTag(xml, 'category'),
            categorySlug: this.extractTag(xml, 'categorySlug'),
            images,
            isNew: this.extractTag(xml, 'isNew') === 'true',
            isPromo: this.extractTag(xml, 'isPromo') === 'true',
            promoPrice: parseFloat(this.extractTag(xml, 'promoPrice')) || undefined,
            isFeatured: this.extractTag(xml, 'isFeatured') === 'true',
            isGlutenFree: this.extractTag(xml, 'isGlutenFree') === 'true',
            isActive: this.extractTag(xml, 'isActive') !== 'false', // default true
            piecesPerHundredGrams: parseInt(this.extractTag(xml, 'piecesPerHundredGrams')) || 5,
            minQuantity: parseInt(this.extractTag(xml, 'minQuantity')) || 100,
            stock: (this.extractTag(xml, 'stock') as ProductWithActive['stock']) || 'in_stock',
            stockQuantity: parseInt(this.extractTag(xml, 'stockQuantity')) || undefined,
            recipe: this.extractTag(xml, 'recipe') || undefined,
            createdAt: this.extractTag(xml, 'createdAt'),
            updatedAt: this.extractTag(xml, 'updatedAt')
        };
    }

    /**
     * Convertit un produit en XML
     */
    private productToXml(product: ProductWithActive): string {
        let xml = '  <product>\n';
        xml += `    ${this.createTag('id', product.id)}\n`;
        xml += `    ${this.createTag('slug', product.slug)}\n`;
        xml += `    ${this.createTag('name', product.name)}\n`;
        xml += `    ${this.createTag('description', product.description)}\n`;
        xml += `    ${this.createTag('composition', product.composition)}\n`;
        xml += `    ${this.createTag('conservation', product.conservation)}\n`;
        xml += `    ${this.createTag('price', product.price)}\n`;
        xml += `    ${this.createTag('priceUnit', product.priceUnit)}\n`;
        xml += `    ${this.createTag('category', product.category)}\n`;
        xml += `    ${this.createTag('categorySlug', product.categorySlug)}\n`;
        xml += '    <images>\n';
        product.images.forEach(img => {
            xml += `      ${this.createTag('image', img)}\n`;
        });
        xml += '    </images>\n';
        xml += `    ${this.createTag('isNew', product.isNew)}\n`;
        xml += `    ${this.createTag('isPromo', product.isPromo)}\n`;
        if (product.promoPrice !== undefined) xml += `    ${this.createTag('promoPrice', product.promoPrice)}\n`;
        xml += `    ${this.createTag('isFeatured', product.isFeatured)}\n`;
        xml += `    ${this.createTag('isGlutenFree', product.isGlutenFree)}\n`;
        xml += `    ${this.createTag('isActive', product.isActive)}\n`;
        xml += `    ${this.createTag('piecesPerHundredGrams', product.piecesPerHundredGrams)}\n`;
        xml += `    ${this.createTag('minQuantity', product.minQuantity)}\n`;
        xml += `    ${this.createTag('stock', product.stock)}\n`;
        if (product.stockQuantity !== undefined) xml += `    ${this.createTag('stockQuantity', product.stockQuantity)}\n`;
        if (product.recipe !== undefined) xml += `    ${this.createTag('recipe', product.recipe)}\n`;
        xml += `    ${this.createTag('createdAt', product.createdAt)}\n`;
        xml += `    ${this.createTag('updatedAt', product.updatedAt)}\n`;
        xml += '  </product>';
        return xml;
    }

    /**
     * Sauvegarde tous les produits
     */
    private async saveAll(products: ProductWithActive[]): Promise<void> {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<products>\n';
        xml += products.map(p => this.productToXml(p)).join('\n');
        xml += '\n</products>';

        await this.writeXmlFile(this.filename, xml);
    }
}

export const productService = new ProductService();
