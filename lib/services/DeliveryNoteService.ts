import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { DeliveryNote, DeliveryNoteStatus, CreateDeliveryNoteInput, UpdateDeliveryNoteInput } from '@/lib/types/deliveryNote';

export class DeliveryNoteService extends BaseXmlService {
  private filename = 'delivery_notes.xml';

  private generateDeliveryNumber(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BL-${y}${m}-${r}`;
  }

  async getAll(status?: DeliveryNoteStatus): Promise<DeliveryNote[]> {
    const content = await this.readXmlFile(this.filename);
    if (!content) return [];
    const blocks = this.extractAllTags(content, 'deliveryNote');
    let list = blocks.map(b => this.parseDeliveryNote(b)).filter(Boolean) as DeliveryNote[];
    if (status) list = list.filter(d => d.status === status);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  async getById(id: string): Promise<DeliveryNote | null> {
    const list = await this.getAll();
    return list.find(d => d.id === id) || null;
  }

  async getByOrderId(orderId: string): Promise<DeliveryNote[]> {
    const list = await this.getAll();
    return list.filter(d => d.orderId === orderId);
  }

  async create(input: CreateDeliveryNoteInput): Promise<DeliveryNote> {
    const list = await this.getAll();
    const now = this.getCurrentTimestamp();
    const lines = input.lines.map(l => ({ ...l, quantityDelivered: 0 }));
    const dn: DeliveryNote = {
      id: this.generateId(),
      deliveryNumber: this.generateDeliveryNumber(),
      orderId: input.orderId,
      invoiceId: input.invoiceId,
      customer: input.customer,
      lines,
      status: 'pending',
      deliveryDate: input.deliveryDate,
      carrier: input.carrier,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    list.push(dn);
    await this.saveAll(list);
    return dn;
  }

  async update(id: string, input: UpdateDeliveryNoteInput): Promise<DeliveryNote | null> {
    const list = await this.getAll();
    const idx = list.findIndex(d => d.id === id);
    if (idx === -1) return null;
    if (input.status) list[idx].status = input.status;
    if (input.deliveredAt) list[idx].deliveredAt = input.deliveredAt;
    if (input.trackingNumber !== undefined) list[idx].trackingNumber = input.trackingNumber;
    if (input.notes !== undefined) list[idx].notes = input.notes;
    if (input.quantityDelivered?.length) {
      input.quantityDelivered.forEach(({ productId, quantity }) => {
        const line = list[idx].lines.find(l => l.productId === productId);
        if (line) line.quantityDelivered = quantity;
      });
    }
    list[idx].updatedAt = this.getCurrentTimestamp();
    await this.saveAll(list);
    return list[idx];
  }

  private parseCustomer(xml: string): DeliveryNote['customer'] {
    const block = xml.match(/<customer>([\s\S]*?)<\/customer>/);
    const c = { firstName: '', lastName: '', phone: '', address: '', city: '', postalCode: '' };
    if (block) {
      c.firstName = this.extractTag(block[1], 'firstName');
      c.lastName = this.extractTag(block[1], 'lastName');
      c.phone = this.extractTag(block[1], 'phone');
      c.address = this.extractTag(block[1], 'address');
      c.city = this.extractTag(block[1], 'city');
      c.postalCode = this.extractTag(block[1], 'postalCode');
    }
    return c;
  }

  private parseLines(xml: string): DeliveryNote['lines'] {
    const block = xml.match(/<lines>([\s\S]*?)<\/lines>/);
    if (!block) return [];
    const itemBlocks = this.extractAllTags(block[1], 'line');
    return itemBlocks.map(itemXml => ({
      productId: this.extractTag(itemXml, 'productId'),
      productName: this.extractTag(itemXml, 'productName'),
      quantity: parseInt(this.extractTag(itemXml, 'quantity')) || 0,
      unit: this.extractTag(itemXml, 'unit') || 'Kg',
      quantityDelivered: parseInt(this.extractTag(itemXml, 'quantityDelivered')) || 0,
    }));
  }

  private parseDeliveryNote(xml: string): DeliveryNote | null {
    const id = this.extractTag(xml, 'id');
    if (!id) return null;
    return {
      id,
      deliveryNumber: this.extractTag(xml, 'deliveryNumber'),
      orderId: this.extractTag(xml, 'orderId'),
      invoiceId: this.extractTag(xml, 'invoiceId') || undefined,
      customer: this.parseCustomer(xml),
      lines: this.parseLines(xml),
      status: (this.extractTag(xml, 'status') || 'pending') as DeliveryNoteStatus,
      deliveryDate: this.extractTag(xml, 'deliveryDate') || undefined,
      deliveredAt: this.extractTag(xml, 'deliveredAt') || undefined,
      carrier: this.extractTag(xml, 'carrier') || undefined,
      trackingNumber: this.extractTag(xml, 'trackingNumber') || undefined,
      notes: this.extractTag(xml, 'notes') || undefined,
      createdAt: this.extractTag(xml, 'createdAt'),
      updatedAt: this.extractTag(xml, 'updatedAt'),
    };
  }

  private customerToXml(c: DeliveryNote['customer'], indent: string): string {
    let x = `${indent}<customer>\n`;
    ['firstName', 'lastName', 'phone', 'address', 'city', 'postalCode'].forEach(k => {
      x += `${indent}  ${this.createTag(k, (c as Record<string, string>)[k] || '')}\n`;
    });
    x += `${indent}</customer>\n`;
    return x;
  }

  private linesToXml(lines: DeliveryNote['lines'], indent: string): string {
    let x = `${indent}<lines>\n`;
    lines.forEach(l => {
      x += `${indent}  <line>\n`;
      x += `${indent}    ${this.createTag('productId', l.productId)}\n`;
      x += `${indent}    ${this.createTag('productName', l.productName)}\n`;
      x += `${indent}    ${this.createTag('quantity', l.quantity)}\n`;
      x += `${indent}    ${this.createTag('unit', l.unit)}\n`;
      x += `${indent}    ${this.createTag('quantityDelivered', l.quantityDelivered ?? 0)}\n`;
      x += `${indent}  </line>\n`;
    });
    x += `${indent}</lines>\n`;
    return x;
  }

  private deliveryNoteToXml(d: DeliveryNote): string {
    let x = '  <deliveryNote>\n';
    x += `    ${this.createTag('id', d.id)}\n`;
    x += `    ${this.createTag('deliveryNumber', d.deliveryNumber)}\n`;
    x += `    ${this.createTag('orderId', d.orderId)}\n`;
    if (d.invoiceId) x += `    ${this.createTag('invoiceId', d.invoiceId)}\n`;
    x += this.customerToXml(d.customer, '    ');
    x += this.linesToXml(d.lines, '    ');
    x += `    ${this.createTag('status', d.status)}\n`;
    if (d.deliveryDate) x += `    ${this.createTag('deliveryDate', d.deliveryDate)}\n`;
    if (d.deliveredAt) x += `    ${this.createTag('deliveredAt', d.deliveredAt)}\n`;
    if (d.carrier) x += `    ${this.createTag('carrier', d.carrier)}\n`;
    if (d.trackingNumber) x += `    ${this.createTag('trackingNumber', d.trackingNumber)}\n`;
    if (d.notes) x += `    ${this.createTag('notes', d.notes)}\n`;
    x += `    ${this.createTag('createdAt', d.createdAt)}\n`;
    x += `    ${this.createTag('updatedAt', d.updatedAt)}\n`;
    x += '  </deliveryNote>';
    return x;
  }

  private async saveAll(list: DeliveryNote[]): Promise<void> {
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<delivery_notes>\n' + list.map(d => this.deliveryNoteToXml(d)).join('\n') + '\n</delivery_notes>';
    await this.writeXmlFile(this.filename, xml);
  }
}

export const deliveryNoteService = new DeliveryNoteService();
