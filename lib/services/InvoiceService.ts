import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Invoice, InvoiceStatus, CreateInvoiceInput, UpdateInvoiceInput } from '@/lib/types/invoice';

export class InvoiceService extends BaseXmlService {
  private filename = 'invoices.xml';

  private generateInvoiceNumber(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FAC-${y}${m}-${r}`;
  }

  async getAll(status?: InvoiceStatus): Promise<Invoice[]> {
    const content = await this.readXmlFile(this.filename);
    if (!content) return [];
    const blocks = this.extractAllTags(content, 'invoice');
    let list = blocks.map(b => this.parseInvoice(b)).filter(Boolean) as Invoice[];
    if (status) list = list.filter(i => i.status === status);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  async getById(id: string): Promise<Invoice | null> {
    const list = await this.getAll();
    return list.find(i => i.id === id) || null;
  }

  async create(input: CreateInvoiceInput): Promise<Invoice> {
    const list = await this.getAll();
    const now = this.getCurrentTimestamp();
    const inv: Invoice = {
      id: this.generateId(),
      invoiceNumber: this.generateInvoiceNumber(),
      orderId: input.orderId,
      quoteId: input.quoteId,
      customer: input.customer,
      lines: input.lines,
      subtotal: input.subtotal,
      tvaAmount: input.tvaAmount,
      total: input.total,
      status: 'draft',
      dueDate: input.dueDate,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    list.push(inv);
    await this.saveAll(list);
    return inv;
  }

  async update(id: string, input: UpdateInvoiceInput): Promise<Invoice | null> {
    const list = await this.getAll();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return null;
    if (input.status) list[idx].status = input.status;
    if (input.paidAt !== undefined) list[idx].paidAt = input.paidAt;
    if (input.notes !== undefined) list[idx].notes = input.notes;
    list[idx].updatedAt = this.getCurrentTimestamp();
    await this.saveAll(list);
    return list[idx];
  }

  private parseCustomer(xml: string, tag: string): Invoice['customer'] {
    const block = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
    const c = {
      firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', tvaNumber: '' as string | undefined,
    };
    if (block) {
      c.firstName = this.extractTag(block[1], 'firstName');
      c.lastName = this.extractTag(block[1], 'lastName');
      c.email = this.extractTag(block[1], 'email');
      c.phone = this.extractTag(block[1], 'phone');
      c.address = this.extractTag(block[1], 'address');
      c.city = this.extractTag(block[1], 'city');
      c.postalCode = this.extractTag(block[1], 'postalCode');
      const tv = this.extractTag(block[1], 'tvaNumber');
      if (tv) c.tvaNumber = tv;
    }
    return c;
  }

  private parseLines(xml: string): Invoice['lines'] {
    const block = xml.match(/<lines>([\s\S]*?)<\/lines>/);
    if (!block) return [];
    const itemBlocks = this.extractAllTags(block[1], 'line');
    return itemBlocks.map(itemXml => ({
      productId: this.extractTag(itemXml, 'productId'),
      productName: this.extractTag(itemXml, 'productName'),
      quantity: parseInt(this.extractTag(itemXml, 'quantity')) || 0,
      unit: this.extractTag(itemXml, 'unit') || 'Kg',
      unitPrice: parseFloat(this.extractTag(itemXml, 'unitPrice')) || 0,
      tvaRate: parseFloat(this.extractTag(itemXml, 'tvaRate')) || undefined,
      total: parseFloat(this.extractTag(itemXml, 'total')) || 0,
    }));
  }

  private parseInvoice(xml: string): Invoice | null {
    const id = this.extractTag(xml, 'id');
    if (!id) return null;
    const customer = this.parseCustomer(xml, 'customer');
    const lines = this.parseLines(xml);
    return {
      id,
      invoiceNumber: this.extractTag(xml, 'invoiceNumber'),
      orderId: this.extractTag(xml, 'orderId') || undefined,
      quoteId: this.extractTag(xml, 'quoteId') || undefined,
      customer,
      lines,
      subtotal: parseFloat(this.extractTag(xml, 'subtotal')) || 0,
      tvaAmount: parseFloat(this.extractTag(xml, 'tvaAmount')) || 0,
      total: parseFloat(this.extractTag(xml, 'total')) || 0,
      status: (this.extractTag(xml, 'status') || 'draft') as InvoiceStatus,
      dueDate: this.extractTag(xml, 'dueDate'),
      paidAt: this.extractTag(xml, 'paidAt') || undefined,
      notes: this.extractTag(xml, 'notes') || undefined,
      createdAt: this.extractTag(xml, 'createdAt'),
      updatedAt: this.extractTag(xml, 'updatedAt'),
    };
  }

  private customerToXml(c: Invoice['customer'], indent: string): string {
    let x = `${indent}<customer>\n`;
    x += `${indent}  ${this.createTag('firstName', c.firstName)}\n`;
    x += `${indent}  ${this.createTag('lastName', c.lastName)}\n`;
    x += `${indent}  ${this.createTag('email', c.email)}\n`;
    x += `${indent}  ${this.createTag('phone', c.phone)}\n`;
    x += `${indent}  ${this.createTag('address', c.address)}\n`;
    x += `${indent}  ${this.createTag('city', c.city)}\n`;
    x += `${indent}  ${this.createTag('postalCode', c.postalCode)}\n`;
    if (c.tvaNumber) x += `${indent}  ${this.createTag('tvaNumber', c.tvaNumber)}\n`;
    x += `${indent}</customer>\n`;
    return x;
  }

  private linesToXml(lines: Invoice['lines'], indent: string): string {
    let x = `${indent}<lines>\n`;
    lines.forEach(l => {
      x += `${indent}  <line>\n`;
      x += `${indent}    ${this.createTag('productId', l.productId)}\n`;
      x += `${indent}    ${this.createTag('productName', l.productName)}\n`;
      x += `${indent}    ${this.createTag('quantity', l.quantity)}\n`;
      x += `${indent}    ${this.createTag('unit', l.unit)}\n`;
      x += `${indent}    ${this.createTag('unitPrice', l.unitPrice)}\n`;
      if (l.tvaRate != null) x += `${indent}    ${this.createTag('tvaRate', l.tvaRate)}\n`;
      x += `${indent}    ${this.createTag('total', l.total)}\n`;
      x += `${indent}  </line>\n`;
    });
    x += `${indent}</lines>\n`;
    return x;
  }

  private invoiceToXml(inv: Invoice): string {
    let x = '  <invoice>\n';
    x += `    ${this.createTag('id', inv.id)}\n`;
    x += `    ${this.createTag('invoiceNumber', inv.invoiceNumber)}\n`;
    if (inv.orderId) x += `    ${this.createTag('orderId', inv.orderId)}\n`;
    if (inv.quoteId) x += `    ${this.createTag('quoteId', inv.quoteId)}\n`;
    x += this.customerToXml(inv.customer, '    ');
    x += this.linesToXml(inv.lines, '    ');
    x += `    ${this.createTag('subtotal', inv.subtotal)}\n`;
    x += `    ${this.createTag('tvaAmount', inv.tvaAmount)}\n`;
    x += `    ${this.createTag('total', inv.total)}\n`;
    x += `    ${this.createTag('status', inv.status)}\n`;
    x += `    ${this.createTag('dueDate', inv.dueDate)}\n`;
    if (inv.paidAt) x += `    ${this.createTag('paidAt', inv.paidAt)}\n`;
    if (inv.notes) x += `    ${this.createTag('notes', inv.notes)}\n`;
    x += `    ${this.createTag('createdAt', inv.createdAt)}\n`;
    x += `    ${this.createTag('updatedAt', inv.updatedAt)}\n`;
    x += '  </invoice>';
    return x;
  }

  private async saveAll(list: Invoice[]): Promise<void> {
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<invoices>\n' + list.map(i => this.invoiceToXml(i)).join('\n') + '\n</invoices>';
    await this.writeXmlFile(this.filename, xml);
  }
}

export const invoiceService = new InvoiceService();
