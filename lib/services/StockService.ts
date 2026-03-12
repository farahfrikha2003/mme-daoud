import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { StockMovement, CreateStockMovementInput } from '@/lib/types/stock';

export class StockService extends BaseXmlService {
  private filename = 'stock_movements.xml';

  async getAll(productId?: string, type?: StockMovement['type']): Promise<StockMovement[]> {
    const content = await this.readXmlFile(this.filename);
    if (!content) return [];
    const blocks = this.extractAllTags(content, 'movement');
    let list = blocks.map(b => this.parseMovement(b)).filter(Boolean) as StockMovement[];
    if (productId) list = list.filter(m => m.productId === productId);
    if (type) list = list.filter(m => m.type === type);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  async getById(id: string): Promise<StockMovement | null> {
    const list = await this.getAll();
    return list.find(m => m.id === id) || null;
  }

  async create(input: CreateStockMovementInput): Promise<StockMovement> {
    const list = await this.getAll();
    const now = this.getCurrentTimestamp();
    const mov: StockMovement = {
      id: this.generateId(),
      productId: input.productId,
      productName: input.productName || '',
      type: input.type,
      quantity: input.quantity,
      unit: input.unit,
      reason: input.reason,
      reference: input.reference,
      supplierId: input.supplierId,
      orderId: input.orderId,
      createdAt: now,
      createdBy: input.createdBy,
    };
    list.push(mov);
    await this.saveAll(list);
    return mov;
  }

  private parseMovement(xml: string): StockMovement | null {
    const id = this.extractTag(xml, 'id');
    if (!id) return null;
    return {
      id,
      productId: this.extractTag(xml, 'productId'),
      productName: this.extractTag(xml, 'productName'),
      type: (this.extractTag(xml, 'type') || 'in') as StockMovement['type'],
      quantity: parseFloat(this.extractTag(xml, 'quantity')) || 0,
      unit: this.extractTag(xml, 'unit') || 'Kg',
      reason: this.extractTag(xml, 'reason') || undefined,
      reference: this.extractTag(xml, 'reference') || undefined,
      supplierId: this.extractTag(xml, 'supplierId') || undefined,
      orderId: this.extractTag(xml, 'orderId') || undefined,
      createdAt: this.extractTag(xml, 'createdAt'),
      createdBy: this.extractTag(xml, 'createdBy') || undefined,
    };
  }

  private movementToXml(m: StockMovement): string {
    let x = '  <movement>\n';
    x += `    ${this.createTag('id', m.id)}\n`;
    x += `    ${this.createTag('productId', m.productId)}\n`;
    x += `    ${this.createTag('productName', m.productName)}\n`;
    x += `    ${this.createTag('type', m.type)}\n`;
    x += `    ${this.createTag('quantity', m.quantity)}\n`;
    x += `    ${this.createTag('unit', m.unit)}\n`;
    if (m.reason) x += `    ${this.createTag('reason', m.reason)}\n`;
    if (m.reference) x += `    ${this.createTag('reference', m.reference)}\n`;
    if (m.supplierId) x += `    ${this.createTag('supplierId', m.supplierId)}\n`;
    if (m.orderId) x += `    ${this.createTag('orderId', m.orderId)}\n`;
    x += `    ${this.createTag('createdAt', m.createdAt)}\n`;
    if (m.createdBy) x += `    ${this.createTag('createdBy', m.createdBy)}\n`;
    x += '  </movement>';
    return x;
  }

  private async saveAll(list: StockMovement[]): Promise<void> {
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<stock_movements>\n' + list.map(m => this.movementToXml(m)).join('\n') + '\n</stock_movements>';
    await this.writeXmlFile(this.filename, xml);
  }
}

export const stockService = new StockService();
