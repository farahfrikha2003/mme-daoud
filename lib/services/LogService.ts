import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { ActionLog, CreateLogInput, LogFilters } from '@/lib/types/admin';

/**
 * Service de journalisation des actions administratives
 */
export class LogService extends BaseXmlService {
    private filename = 'logs.xml';

    /**
     * Enregistre une action
     */
    async log(input: CreateLogInput): Promise<ActionLog> {
        const logs = await this.getAll();

        const newLog: ActionLog = {
            id: this.generateId(),
            adminId: input.adminId,
            adminUsername: input.adminUsername,
            action: input.action,
            entity: input.entity,
            entityId: input.entityId,
            details: input.details,
            ipAddress: input.ipAddress,
            userAgent: input.userAgent,
            timestamp: this.getCurrentTimestamp()
        };

        logs.unshift(newLog); // Ajouter au début

        // Garder seulement les 10000 derniers logs
        const trimmedLogs = logs.slice(0, 10000);
        await this.saveAll(trimmedLogs);

        return newLog;
    }

    /**
     * Récupère tous les logs
     */
    async getAll(filters?: LogFilters): Promise<ActionLog[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const logBlocks = this.extractAllTags(content, 'log');
        let logs = logBlocks.map(block => this.parseLog(block)).filter(l => l !== null) as ActionLog[];

        // Appliquer les filtres
        if (filters) {
            if (filters.adminId) {
                logs = logs.filter(l => l.adminId === filters.adminId);
            }
            if (filters.action) {
                logs = logs.filter(l => l.action === filters.action);
            }
            if (filters.entity) {
                logs = logs.filter(l => l.entity === filters.entity);
            }
            if (filters.dateFrom) {
                const from = new Date(filters.dateFrom);
                logs = logs.filter(l => new Date(l.timestamp) >= from);
            }
            if (filters.dateTo) {
                const to = new Date(filters.dateTo);
                logs = logs.filter(l => new Date(l.timestamp) <= to);
            }
        }

        return logs;
    }

    /**
     * Récupère les logs paginés
     */
    async getPaginated(page: number = 1, limit: number = 50, filters?: LogFilters): Promise<{
        items: ActionLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }> {
        const allLogs = await this.getAll(filters);
        const total = allLogs.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const items = allLogs.slice(start, start + limit);

        return {
            items,
            total,
            page,
            limit,
            totalPages
        };
    }

    /**
     * Parse un bloc XML log
     */
    private parseLog(xml: string): ActionLog | null {
        const id = this.extractTag(xml, 'id');
        if (!id) return null;

        return {
            id,
            adminId: this.extractTag(xml, 'adminId'),
            adminUsername: this.extractTag(xml, 'adminUsername'),
            action: this.extractTag(xml, 'action') as ActionLog['action'],
            entity: this.extractTag(xml, 'entity') as ActionLog['entity'],
            entityId: this.extractTag(xml, 'entityId') || undefined,
            details: this.extractTag(xml, 'details') || undefined,
            ipAddress: this.extractTag(xml, 'ipAddress') || undefined,
            userAgent: this.extractTag(xml, 'userAgent') || undefined,
            timestamp: this.extractTag(xml, 'timestamp')
        };
    }

    /**
     * Convertit un log en XML
     */
    private logToXml(log: ActionLog): string {
        let xml = '  <log>\n';
        xml += `    ${this.createTag('id', log.id)}\n`;
        xml += `    ${this.createTag('adminId', log.adminId)}\n`;
        xml += `    ${this.createTag('adminUsername', log.adminUsername)}\n`;
        xml += `    ${this.createTag('action', log.action)}\n`;
        xml += `    ${this.createTag('entity', log.entity)}\n`;
        if (log.entityId) xml += `    ${this.createTag('entityId', log.entityId)}\n`;
        if (log.details) xml += `    ${this.createTag('details', log.details)}\n`;
        if (log.ipAddress) xml += `    ${this.createTag('ipAddress', log.ipAddress)}\n`;
        if (log.userAgent) xml += `    ${this.createTag('userAgent', log.userAgent)}\n`;
        xml += `    ${this.createTag('timestamp', log.timestamp)}\n`;
        xml += '  </log>';
        return xml;
    }

    /**
     * Sauvegarde tous les logs
     */
    private async saveAll(logs: ActionLog[]): Promise<void> {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<logs>\n';
        xml += logs.map(l => this.logToXml(l)).join('\n');
        xml += '\n</logs>';

        await this.writeXmlFile(this.filename, xml);
    }
}

export const logService = new LogService();
