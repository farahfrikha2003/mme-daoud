import fs from 'fs/promises';
import path from 'path';

export interface XmlDataItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export class XmlStorageService {
  private xmlDir: string;

  constructor() {
    this.xmlDir = path.join(process.cwd(), 'data', 'xml');
  }

  /**
   * Initialise le répertoire de stockage XML
   */
  async initialize(): Promise<void> {
    try {
      await fs.access(this.xmlDir);
    } catch {
      await fs.mkdir(this.xmlDir, { recursive: true });
    }
  }

  /**
   * Convertit un objet JavaScript en XML
   */
  private objectToXml(obj: XmlDataItem): string {
    const xmlContent = Object.entries(obj)
      .map(([key, value]) => `  <${key}>${this.escapeXml(String(value))}</${key}>`)
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<data>
${xmlContent}
</data>`;
  }

  /**
   * Convertit du XML en objet JavaScript
   */
  private xmlToObject(xmlString: string): XmlDataItem {
    // Parser XML simple pour les besoins basiques
    const cleanXml = xmlString.replace(/<\?xml.*?\?>|<\/?data>/g, '').trim();

    const result: XmlDataItem = {
      id: '',
      title: '',
      description: '',
      createdAt: '',
      updatedAt: ''
    };

    const regex = /<(\w+)>([\s\S]*?)<\/\1>/g;
    let match;

    while ((match = regex.exec(cleanXml)) !== null) {
      const [, key, value] = match;
      result[key] = this.unescapeXml(value);
    }

    return result;
  }

  /**
   * Échappe les caractères XML
   */
  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&#39;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  /**
   * Déséchappe les caractères XML
   */
  private unescapeXml(safe: string): string {
    return safe.replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');
  }

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Sauvegarde un élément dans un fichier XML
   */
  async save(item: Omit<XmlDataItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<XmlDataItem> {
    await this.initialize();

    const now = new Date().toISOString();
    const dataItem: XmlDataItem = {
      ...item,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    } as XmlDataItem;

    const xmlContent = this.objectToXml(dataItem);
    const filePath = path.join(this.xmlDir, `${dataItem.id}.xml`);

    await fs.writeFile(filePath, xmlContent, 'utf-8');

    return dataItem;
  }

  /**
   * Met à jour un élément existant
   */
  async update(id: string, updates: Partial<Omit<XmlDataItem, 'id' | 'createdAt'>>): Promise<XmlDataItem | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const updated: XmlDataItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const xmlContent = this.objectToXml(updated);
    const filePath = path.join(this.xmlDir, `${id}.xml`);

    await fs.writeFile(filePath, xmlContent, 'utf-8');

    return updated;
  }

  /**
   * Récupère un élément par son ID
   */
  async getById(id: string): Promise<XmlDataItem | null> {
    try {
      const filePath = path.join(this.xmlDir, `${id}.xml`);
      const xmlContent = await fs.readFile(filePath, 'utf-8');
      return this.xmlToObject(xmlContent);
    } catch {
      return null;
    }
  }

  /**
   * Récupère tous les éléments
   */
  async getAll(): Promise<XmlDataItem[]> {
    await this.initialize();

    try {
      const files = await fs.readdir(this.xmlDir);
      const xmlFiles = files.filter(file => file.endsWith('.xml'));

      const items: XmlDataItem[] = [];

      for (const file of xmlFiles) {
        try {
          const id = path.basename(file, '.xml');
          const item = await this.getById(id);
          if (item) {
            items.push(item);
          }
        } catch (error) {
          console.error(`Erreur lors de la lecture du fichier ${file}:`, error);
        }
      }

      // Trier par date de création (plus récent en premier)
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  /**
   * Supprime un élément
   */
  async delete(id: string): Promise<boolean> {
    try {
      const filePath = path.join(this.xmlDir, `${id}.xml`);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Recherche des éléments par titre ou description
   */
  async search(query: string): Promise<XmlDataItem[]> {
    const all = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return all.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
  }
}

// Instance singleton
export const xmlStorage = new XmlStorageService();