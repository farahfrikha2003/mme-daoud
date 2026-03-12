import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Payment, CreatePaymentInput, UpdatePaymentInput } from '@/lib/types/payment';

export class PaymentService extends BaseXmlService {
  private filename = 'payments.xml';

  private generateReference(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `PAY-${y}${m}-${r}`;
  }

  async getAll(orderId?: string, invoiceId?: string): Promise<Payment[]> {
    const content = await this.readXmlFile(this.filename);
    if (!content) return [];
    const blocks = this.extractAllTags(content, 'payment');
    let list = blocks.map(b => this.parsePayment(b)).filter(Boolean) as Payment[];
    if (orderId) list = list.filter(p => p.orderId === orderId);
    if (invoiceId) list = list.filter(p => p.invoiceId === invoiceId);
    list.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
    return list;
  }

  async getById(id: string): Promise<Payment | null> {
    const list = await this.getAll();
    return list.find(p => p.id === id) || null;
  }

  async create(input: CreatePaymentInput): Promise<Payment> {
    const list = await this.getAll();
    const now = this.getCurrentTimestamp();
    const pay: Payment = {
      id: this.generateId(),
      reference: this.generateReference(),
      orderId: input.orderId,
      invoiceId: input.invoiceId,
      type: input.type,
      amount: input.amount,
      method: input.method,
      paidAt: input.paidAt,
      referenceNumber: input.referenceNumber,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    };
    list.push(pay);
    await this.saveAll(list);
    return pay;
  }

  async update(id: string, input: UpdatePaymentInput): Promise<Payment | null> {
    const list = await this.getAll();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    if (input.amount !== undefined) list[idx].amount = input.amount;
    if (input.method) list[idx].method = input.method;
    if (input.paidAt) list[idx].paidAt = input.paidAt;
    if (input.referenceNumber !== undefined) list[idx].referenceNumber = input.referenceNumber;
    if (input.notes !== undefined) list[idx].notes = input.notes;
    list[idx].updatedAt = this.getCurrentTimestamp();
    await this.saveAll(list);
    return list[idx];
  }

  private parsePayment(xml: string): Payment | null {
    const id = this.extractTag(xml, 'id');
    if (!id) return null;
    return {
      id,
      reference: this.extractTag(xml, 'reference'),
      orderId: this.extractTag(xml, 'orderId') || undefined,
      invoiceId: this.extractTag(xml, 'invoiceId') || undefined,
      type: (this.extractTag(xml, 'type') || 'full') as Payment['type'],
      amount: parseFloat(this.extractTag(xml, 'amount')) || 0,
      method: (this.extractTag(xml, 'method') || 'cash') as Payment['method'],
      paidAt: this.extractTag(xml, 'paidAt'),
      referenceNumber: this.extractTag(xml, 'referenceNumber') || undefined,
      notes: this.extractTag(xml, 'notes') || undefined,
      createdAt: this.extractTag(xml, 'createdAt'),
      updatedAt: this.extractTag(xml, 'updatedAt'),
      createdBy: this.extractTag(xml, 'createdBy') || undefined,
    };
  }

  private paymentToXml(p: Payment): string {
    let x = '  <payment>\n';
    x += `    ${this.createTag('id', p.id)}\n`;
    x += `    ${this.createTag('reference', p.reference)}\n`;
    if (p.orderId) x += `    ${this.createTag('orderId', p.orderId)}\n`;
    if (p.invoiceId) x += `    ${this.createTag('invoiceId', p.invoiceId)}\n`;
    x += `    ${this.createTag('type', p.type)}\n`;
    x += `    ${this.createTag('amount', p.amount)}\n`;
    x += `    ${this.createTag('method', p.method)}\n`;
    x += `    ${this.createTag('paidAt', p.paidAt)}\n`;
    if (p.referenceNumber) x += `    ${this.createTag('referenceNumber', p.referenceNumber)}\n`;
    if (p.notes) x += `    ${this.createTag('notes', p.notes)}\n`;
    x += `    ${this.createTag('createdAt', p.createdAt)}\n`;
    x += `    ${this.createTag('updatedAt', p.updatedAt)}\n`;
    if (p.createdBy) x += `    ${this.createTag('createdBy', p.createdBy)}\n`;
    x += '  </payment>';
    return x;
  }

  private async saveAll(list: Payment[]): Promise<void> {
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<payments>\n' + list.map(p => this.paymentToXml(p)).join('\n') + '\n</payments>';
    await this.writeXmlFile(this.filename, xml);
  }
}

export const paymentService = new PaymentService();
