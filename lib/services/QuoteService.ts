import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Quote, QuoteStatus, CreateQuoteInput, UpdateQuoteInput } from '@/lib/types/quote';

export class QuoteService extends BaseXmlService {
  private filename = 'quotes.xml';

  private generateQuoteNumber(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DEV-${y}${m}-${r}`;
  }

  async getAll(status?: QuoteStatus): Promise<Quote[]> {
    const content = await this.readXmlFile(this.filename);
    if (!content) return [];
    const blocks = this.extractAllTags(content, 'quote');
    let list = blocks.map(b => this.parseQuote(b)).filter(Boolean) as Quote[];
    if (status) list = list.filter(q => q.status === status);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  async getById(id: string): Promise<Quote | null> {
    const list = await this.getAll();
    return list.find(q => q.id === id) || null;
  }

  async create(input: CreateQuoteInput): Promise<Quote> {
    const list = await this.getAll();
    const now = this.getCurrentTimestamp();
    const quote: Quote = {
      id: this.generateId(),
      quoteNumber: this.generateQuoteNumber(),
      customer: input.customer,
      lines: input.lines,
      subtotal: input.subtotal,
      tvaAmount: input.tvaAmount,
      total: input.total,
      status: 'draft',
      validUntil: input.validUntil,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    list.push(quote);
    await this.saveAll(list);
    return quote;
  }

  async update(id: string, input: UpdateQuoteInput): Promise<Quote | null> {
    const list = await this.getAll();
    const idx = list.findIndex(q => q.id === id);
    if (idx === -1) return null;
    if (input.status) list[idx].status = input.status;
    if (input.notes !== undefined) list[idx].notes = input.notes;
    list[idx].updatedAt = this.getCurrentTimestamp();
    await this.saveAll(list);
    return list[idx];
  }

  private parseCustomer(xml: string): Quote['customer'] {
    const block = xml.match(/<customer>([\s\S]*?)<\/customer>/);
    const c = {
      firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '', company: '',
    };
    if (block) {
      c.firstName = this.extractTag(block[1], 'firstName');
      c.lastName = this.extractTag(block[1], 'lastName');
      c.email = this.extractTag(block[1], 'email');
      c.phone = this.extractTag(block[1], 'phone');
      c.address = this.extractTag(block[1], 'address');
      c.city = this.extractTag(block[1], 'city');
      c.postalCode = this.extractTag(block[1], 'postalCode');
      c.company = this.extractTag(block[1], 'company');
    }
    return c;
  }

  private parseLines(xml: string): Quote['lines'] {
    const block = xml.match(/<lines>([\s\S]*?)<\/lines>/);
    if (!block) return [];
    const itemBlocks = this.extractAllTags(block[1], 'line');
    return itemBlocks.map(itemXml => ({
      productId: this.extractTag(itemXml, 'productId'),
      productName: this.extractTag(itemXml, 'productName'),
      description: this.extractTag(itemXml, 'description') || undefined,
      quantity: parseInt(this.extractTag(itemXml, 'quantity')) || 0,
      unit: this.extractTag(itemXml, 'unit') || 'Kg',
      unitPrice: parseFloat(this.extractTag(itemXml, 'unitPrice')) || 0,
      tvaRate: parseFloat(this.extractTag(itemXml, 'tvaRate')) || undefined,
      total: parseFloat(this.extractTag(itemXml, 'total')) || 0,
    }));
  }

  private parseQuote(xml: string): Quote | null {
    const id = this.extractTag(xml, 'id');
    if (!id) return null;
    return {
      id,
      quoteNumber: this.extractTag(xml, 'quoteNumber'),
      customer: this.parseCustomer(xml),
      lines: this.parseLines(xml),
      subtotal: parseFloat(this.extractTag(xml, 'subtotal')) || 0,
      tvaAmount: parseFloat(this.extractTag(xml, 'tvaAmount')) || 0,
      total: parseFloat(this.extractTag(xml, 'total')) || 0,
      status: (this.extractTag(xml, 'status') || 'draft') as QuoteStatus,
      validUntil: this.extractTag(xml, 'validUntil'),
      notes: this.extractTag(xml, 'notes') || undefined,
      createdAt: this.extractTag(xml, 'createdAt'),
      updatedAt: this.extractTag(xml, 'updatedAt'),
    };
  }

  private customerToXml(c: Quote['customer'], indent: string): string {
    let x = `${indent}<customer>\n`;
    ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'company'].forEach(k => {
      const v = (c as Record<string, string>)[k];
      if (v) x += `${indent}  ${this.createTag(k, v)}\n`;
    });
    x += `${indent}</customer>\n`;
    return x;
  }

  private linesToXml(lines: Quote['lines'], indent: string): string {
    let x = `${indent}<lines>\n`;
    lines.forEach(l => {
      x += `${indent}  <line>\n`;
      x += `${indent}    ${this.createTag('productId', l.productId)}\n`;
      x += `${indent}    ${this.createTag('productName', l.productName)}\n`;
      if (l.description) x += `${indent}    ${this.createTag('description', l.description)}\n`;
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

  private quoteToXml(q: Quote): string {
    let x = '  <quote>\n';
    x += `    ${this.createTag('id', q.id)}\n`;
    x += `    ${this.createTag('quoteNumber', q.quoteNumber)}\n`;
    x += this.customerToXml(q.customer, '    ');
    x += this.linesToXml(q.lines, '    ');
    x += `    ${this.createTag('subtotal', q.subtotal)}\n`;
    x += `    ${this.createTag('tvaAmount', q.tvaAmount)}\n`;
    x += `    ${this.createTag('total', q.total)}\n`;
    x += `    ${this.createTag('status', q.status)}\n`;
    x += `    ${this.createTag('validUntil', q.validUntil)}\n`;
    if (q.notes) x += `    ${this.createTag('notes', q.notes)}\n`;
    x += `    ${this.createTag('createdAt', q.createdAt)}\n`;
    x += `    ${this.createTag('updatedAt', q.updatedAt)}\n`;
    x += '  </quote>';
    return x;
  }

  private async saveAll(list: Quote[]): Promise<void> {
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<quotes>\n' + list.map(q => this.quoteToXml(q)).join('\n') + '\n</quotes>';
    await this.writeXmlFile(this.filename, xml);
  }
}

export const quoteService = new QuoteService();
