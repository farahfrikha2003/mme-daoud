import fs from 'fs/promises';
import path from 'path';

/**
 * Service de base pour les opérations XML
 * Fournit des méthodes utilitaires communes
 */
export class BaseXmlService {
    protected xmlDir: string;
    protected backupDir: string;

    constructor() {
        this.xmlDir = path.join(process.cwd(), 'data', 'xml');
        this.backupDir = path.join(process.cwd(), 'data', 'backups');
    }

    /**
     * Initialise les répertoires nécessaires
     */
    protected async ensureDirectories(): Promise<void> {
        try {
            await fs.access(this.xmlDir);
        } catch {
            await fs.mkdir(this.xmlDir, { recursive: true });
        }

        try {
            await fs.access(this.backupDir);
        } catch {
            await fs.mkdir(this.backupDir, { recursive: true });
        }
    }

    /**
     * Lit un fichier XML
     */
    protected async readXmlFile(filename: string): Promise<string> {
        const filePath = path.join(this.xmlDir, filename);
        console.log(`[XML] CWD: "${process.cwd()}"`);
        console.log(`[XML] Reading file: "${filePath}"`);
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            console.log(`[XML] File read successfully (${content.length} chars)`);
            console.log(`[XML] Content snippet: "${content.substring(0, 50).replace(/\n/g, '\\n')}"...`);
            return content;
        } catch (error) {
            console.error(`[XML] Error reading file "${filePath}":`, error);
            return '';
        }
    }

    /**
     * Écrit dans un fichier XML avec backup automatique
     */
    protected async writeXmlFile(filename: string, content: string): Promise<void> {
        await this.ensureDirectories();
        const filePath = path.join(this.xmlDir, filename);

        // Créer un backup avant modification
        try {
            const existingContent = await fs.readFile(filePath, 'utf-8');
            if (existingContent) {
                await this.createBackup(filename, existingContent);
            }
        } catch {
            // Fichier n'existe pas encore, pas de backup nécessaire
        }

        await fs.writeFile(filePath, content, 'utf-8');
    }

    /**
     * Crée un backup d'un fichier XML
     */
    protected async createBackup(filename: string, content: string): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFolder = path.join(this.backupDir, timestamp);

        try {
            await fs.access(backupFolder);
        } catch {
            await fs.mkdir(backupFolder, { recursive: true });
        }

        const backupPath = path.join(backupFolder, filename);
        await fs.writeFile(backupPath, content, 'utf-8');
    }

    /**
     * Génère un ID unique
     */
    protected generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Échappe les caractères XML spéciaux
     */
    protected escapeXml(unsafe: string): string {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Déséchappe les caractères XML
     */
    protected unescapeXml(safe: string): string {
        if (!safe) return '';
        return safe
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"');
    }

    /**
     * Extrait la valeur d'une balise XML
     */
    protected extractTag(xml: string, tag: string): string {
        const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
        const match = xml.match(regex);
        return match ? this.unescapeXml(match[1].trim()) : '';
    }

    /**
     * Extrait toutes les occurrences d'une balise
     */
    protected extractAllTags(xml: string, tag: string): string[] {
        const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
        const matches: string[] = [];
        let match;
        while ((match = regex.exec(xml)) !== null) {
            matches.push(match[1].trim());
        }
        return matches;
    }

    /**
     * Crée une balise XML
     */
    protected createTag(tag: string, value: string | number | boolean): string {
        return `<${tag}>${this.escapeXml(String(value))}</${tag}>`;
    }

    /**
     * Obtient la date/heure actuelle en format ISO
     */
    protected getCurrentTimestamp(): string {
        return new Date().toISOString();
    }
}
