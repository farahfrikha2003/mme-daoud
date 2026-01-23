import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Order, OrderStatus, OrderCustomer, OrderItem, OrderHistoryEvent, OrderFilters } from '@/lib/types/admin';

export interface CreateOrderInput {
    customer: OrderCustomer;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    notes?: string;
}

/**
 * Service de gestion des commandes en XML
 */
export class OrderService extends BaseXmlService {
    private filename = 'orders.xml';

    /**
     * Génère un numéro de commande unique
     */
    private generateOrderNumber(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `CMD-${year}${month}${day}-${random}`;
    }

    /**
     * Récupère toutes les commandes
     */
    async getAll(filters?: OrderFilters): Promise<Order[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const orderBlocks = this.extractAllTags(content, 'order');
        let orders = orderBlocks.map(block => this.parseOrder(block)).filter(o => o !== null) as Order[];

        // Tri par date décroissante
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Appliquer les filtres
        if (filters) {
            if (filters.status) {
                orders = orders.filter(o => o.status === filters.status);
            }
            if (filters.search) {
                const search = filters.search.toLowerCase();
                orders = orders.filter(o =>
                    o.orderNumber.toLowerCase().includes(search) ||
                    o.customer.firstName.toLowerCase().includes(search) ||
                    o.customer.lastName.toLowerCase().includes(search) ||
                    o.customer.email.toLowerCase().includes(search)
                );
            }
            if (filters.dateFrom) {
                const from = new Date(filters.dateFrom);
                orders = orders.filter(o => new Date(o.createdAt) >= from);
            }
            if (filters.dateTo) {
                const to = new Date(filters.dateTo);
                orders = orders.filter(o => new Date(o.createdAt) <= to);
            }
        }

        return orders;
    }

    /**
     * Récupère une commande par ID
     */
    async getById(id: string): Promise<Order | null> {
        const orders = await this.getAll();
        return orders.find(o => o.id === id) || null;
    }

    /**
     * Récupère une commande par numéro
     */
    async getByOrderNumber(orderNumber: string): Promise<Order | null> {
        const orders = await this.getAll();
        return orders.find(o => o.orderNumber === orderNumber) || null;
    }

    /**
     * Crée une nouvelle commande
     */
    async create(input: CreateOrderInput): Promise<Order> {
        const orders = await this.getAll();
        const now = this.getCurrentTimestamp();

        const newOrder: Order = {
            id: this.generateId(),
            orderNumber: this.generateOrderNumber(),
            status: 'pending',
            customer: input.customer,
            items: input.items,
            subtotal: input.subtotal,
            shipping: input.shipping,
            total: input.total,
            notes: input.notes,
            history: [
                {
                    status: 'pending',
                    timestamp: now,
                    note: 'Commande créée'
                }
            ],
            createdAt: now,
            updatedAt: now
        };

        orders.push(newOrder);
        await this.saveAll(orders);

        return newOrder;
    }

    /**
     * Change le statut d'une commande
     */
    async updateStatus(id: string, newStatus: OrderStatus, adminId?: string, note?: string): Promise<Order | null> {
        const orders = await this.getAll();
        const index = orders.findIndex(o => o.id === id);

        if (index === -1) return null;

        const now = this.getCurrentTimestamp();
        const historyEvent: OrderHistoryEvent = {
            status: newStatus,
            timestamp: now,
            adminId,
            note
        };

        orders[index].status = newStatus;
        orders[index].history.push(historyEvent);
        orders[index].updatedAt = now;

        await this.saveAll(orders);

        return orders[index];
    }

    /**
     * Ajoute une note à une commande
     */
    async addNote(id: string, note: string): Promise<Order | null> {
        const orders = await this.getAll();
        const index = orders.findIndex(o => o.id === id);

        if (index === -1) return null;

        orders[index].notes = note;
        orders[index].updatedAt = this.getCurrentTimestamp();

        await this.saveAll(orders);

        return orders[index];
    }

    /**
     * Obtient les statistiques des commandes
     */
    async getStats(): Promise<{
        total: number;
        pending: number;
        confirmed: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        totalRevenue: number;
    }> {
        const orders = await this.getAll();

        const stats = {
            total: orders.length,
            pending: 0,
            confirmed: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
            totalRevenue: 0
        };

        orders.forEach(order => {
            stats[order.status]++;
            if (order.status !== 'cancelled') {
                stats.totalRevenue += order.total;
            }
        });

        return stats;
    }

    /**
     * Parse un bloc XML commande
     */
    private parseOrder(xml: string): Order | null {
        const id = this.extractTag(xml, 'id');
        if (!id) return null;

        // Parse customer
        const customerBlock = xml.match(/<customer>([\s\S]*?)<\/customer>/);
        const customer: OrderCustomer = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            postalCode: ''
        };
        if (customerBlock) {
            customer.firstName = this.extractTag(customerBlock[1], 'firstName');
            customer.lastName = this.extractTag(customerBlock[1], 'lastName');
            customer.email = this.extractTag(customerBlock[1], 'email');
            customer.phone = this.extractTag(customerBlock[1], 'phone');
            customer.address = this.extractTag(customerBlock[1], 'address');
            customer.city = this.extractTag(customerBlock[1], 'city');
            customer.postalCode = this.extractTag(customerBlock[1], 'postalCode');
        }

        // Parse items
        const itemsBlock = xml.match(/<items>([\s\S]*?)<\/items>/);
        const items: OrderItem[] = [];
        if (itemsBlock) {
            const itemBlocks = this.extractAllTags(itemsBlock[1], 'item');
            itemBlocks.forEach(itemXml => {
                items.push({
                    productId: this.extractTag(itemXml, 'productId'),
                    productName: this.extractTag(itemXml, 'productName'),
                    quantity: parseInt(this.extractTag(itemXml, 'quantity')) || 0,
                    unitPrice: parseFloat(this.extractTag(itemXml, 'unitPrice')) || 0,
                    total: parseFloat(this.extractTag(itemXml, 'total')) || 0
                });
            });
        }

        // Parse history
        const historyBlock = xml.match(/<history>([\s\S]*?)<\/history>/);
        const history: OrderHistoryEvent[] = [];
        if (historyBlock) {
            const eventBlocks = this.extractAllTags(historyBlock[1], 'event');
            eventBlocks.forEach(eventXml => {
                history.push({
                    status: this.extractTag(eventXml, 'status') as OrderStatus,
                    timestamp: this.extractTag(eventXml, 'timestamp'),
                    adminId: this.extractTag(eventXml, 'adminId') || undefined,
                    note: this.extractTag(eventXml, 'note') || undefined
                });
            });
        }

        return {
            id,
            orderNumber: this.extractTag(xml, 'orderNumber'),
            status: this.extractTag(xml, 'status') as OrderStatus,
            customer,
            items,
            subtotal: parseFloat(this.extractTag(xml, 'subtotal')) || 0,
            shipping: parseFloat(this.extractTag(xml, 'shipping')) || 0,
            total: parseFloat(this.extractTag(xml, 'total')) || 0,
            notes: this.extractTag(xml, 'notes') || undefined,
            history,
            createdAt: this.extractTag(xml, 'createdAt'),
            updatedAt: this.extractTag(xml, 'updatedAt')
        };
    }

    /**
     * Convertit une commande en XML
     */
    private orderToXml(order: Order): string {
        let xml = '  <order>\n';
        xml += `    ${this.createTag('id', order.id)}\n`;
        xml += `    ${this.createTag('orderNumber', order.orderNumber)}\n`;
        xml += `    ${this.createTag('status', order.status)}\n`;

        // Customer
        xml += '    <customer>\n';
        xml += `      ${this.createTag('firstName', order.customer.firstName)}\n`;
        xml += `      ${this.createTag('lastName', order.customer.lastName)}\n`;
        xml += `      ${this.createTag('email', order.customer.email)}\n`;
        xml += `      ${this.createTag('phone', order.customer.phone)}\n`;
        xml += `      ${this.createTag('address', order.customer.address)}\n`;
        xml += `      ${this.createTag('city', order.customer.city)}\n`;
        xml += `      ${this.createTag('postalCode', order.customer.postalCode)}\n`;
        xml += '    </customer>\n';

        // Items
        xml += '    <items>\n';
        order.items.forEach(item => {
            xml += '      <item>\n';
            xml += `        ${this.createTag('productId', item.productId)}\n`;
            xml += `        ${this.createTag('productName', item.productName)}\n`;
            xml += `        ${this.createTag('quantity', item.quantity)}\n`;
            xml += `        ${this.createTag('unitPrice', item.unitPrice)}\n`;
            xml += `        ${this.createTag('total', item.total)}\n`;
            xml += '      </item>\n';
        });
        xml += '    </items>\n';

        xml += `    ${this.createTag('subtotal', order.subtotal)}\n`;
        xml += `    ${this.createTag('shipping', order.shipping)}\n`;
        xml += `    ${this.createTag('total', order.total)}\n`;
        if (order.notes) xml += `    ${this.createTag('notes', order.notes)}\n`;

        // History
        xml += '    <history>\n';
        order.history.forEach(event => {
            xml += '      <event>\n';
            xml += `        ${this.createTag('status', event.status)}\n`;
            xml += `        ${this.createTag('timestamp', event.timestamp)}\n`;
            if (event.adminId) xml += `        ${this.createTag('adminId', event.adminId)}\n`;
            if (event.note) xml += `        ${this.createTag('note', event.note)}\n`;
            xml += '      </event>\n';
        });
        xml += '    </history>\n';

        xml += `    ${this.createTag('createdAt', order.createdAt)}\n`;
        xml += `    ${this.createTag('updatedAt', order.updatedAt)}\n`;
        xml += '  </order>';
        return xml;
    }

    /**
     * Sauvegarde toutes les commandes
     */
    private async saveAll(orders: Order[]): Promise<void> {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<orders>\n';
        xml += orders.map(o => this.orderToXml(o)).join('\n');
        xml += '\n</orders>';

        await this.writeXmlFile(this.filename, xml);
    }
}

export const orderService = new OrderService();
