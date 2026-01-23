import { BaseXmlService } from '@/lib/xml/BaseXmlService';

export interface Visit {
    id: string;
    path: string;
    timestamp: string;
    ip?: string;
    userAgent?: string;
}

export class VisitService extends BaseXmlService {
    private filename = 'visits.xml';

    async logVisit(path: string, ip?: string, userAgent?: string): Promise<void> {
        const visits = await this.getAll();
        const newVisit: Visit = {
            id: this.generateId(),
            path,
            timestamp: this.getCurrentTimestamp(),
            ip,
            userAgent
        };
        visits.push(newVisit);
        await this.saveAll(visits);
    }

    async getAll(): Promise<Visit[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const visitBlocks = this.extractAllTags(content, 'visit');
        return visitBlocks.map((block: string) => ({
            id: this.extractTag(block, 'id'),
            path: this.extractTag(block, 'path'),
            timestamp: this.extractTag(block, 'timestamp'),
            ip: this.extractTag(block, 'ip') || undefined,
            userAgent: this.extractTag(block, 'userAgent') || undefined
        }));
    }

    async getStats(): Promise<{
        total: number;
        today: number;
        last7Days: number[];
    }> {
        const visits = await this.getAll();
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        const todayCount = visits.filter(v => v.timestamp.startsWith(todayStr)).length;

        const last7Days = Array(7).fill(0);
        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last7Days[6 - i] = visits.filter(v => v.timestamp.startsWith(dateStr)).length;
        }

        return {
            total: visits.length,
            today: todayCount,
            last7Days
        };
    }

    private async saveAll(visits: Visit[]): Promise<void> {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<visits>\n';
        xml += visits.map(v => `  <visit>\n    <id>${v.id}</id>\n    <path>${v.path}</path>\n    <timestamp>${v.timestamp}</timestamp>\n    ${v.ip ? `<ip>${v.ip}</ip>\n` : ''}    ${v.userAgent ? `<userAgent>${v.userAgent}</userAgent>\n` : ''}  </visit>`).join('\n');
        xml += '\n</visits>';
        await this.writeXmlFile(this.filename, xml);
    }
}

export const visitService = new VisitService();
