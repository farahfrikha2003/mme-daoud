import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Supplier, CreateSupplierInput, UpdateSupplierInput } from '@/lib/types/supplier';

export class SupplierService extends BaseXmlService {
  private filename = 'suppliers.xml';

  async getAll(activeOnly = false): Promise<Supplier[]> {
    const content = await this.readXmlFile(this.filename);
    if (!content) return [];
    const blocks = this.extractAllTags(content, 'supplier');
    let list = blocks.map(b => this.parseSupplier(b)).filter(Boolean) as Supplier[];
    if (activeOnly) list = list.filter(s => s.isActive);
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }

  async getById(id: string): Promise<Supplier | null> {
    const list = await this.getAll();
    return list.find(s => s.id === id) || null;
  }

  async create(input: CreateSupplierInput): Promise<Supplier> {
    const list = await this.getAll();
    const now = this.getCurrentTimestamp();
    const sup: Supplier = {
      id: this.generateId(),
      name: input.name,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      postalCode: input.postalCode,
      country: input.country,
      tvaNumber: input.tvaNumber,
      notes: input.notes,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    list.push(sup);
    await this.saveAll(list);
    return sup;
  }

  async update(id: string, input: UpdateSupplierInput): Promise<Supplier | null> {
    const list = await this.getAll();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    Object.assign(list[idx], input);
    list[idx].updatedAt = this.getCurrentTimestamp();
    await this.saveAll(list);
    return list[idx];
  }

  private parseSupplier(xml: string): Supplier | null {
    const id = this.extractTag(xml, 'id');
    if (!id) return null;
    return {
      id,
      name: this.extractTag(xml, 'name'),
      contactName: this.extractTag(xml, 'contactName') || undefined,
      email: this.extractTag(xml, 'email'),
      phone: this.extractTag(xml, 'phone'),
      address: this.extractTag(xml, 'address') || undefined,
      city: this.extractTag(xml, 'city') || undefined,
      postalCode: this.extractTag(xml, 'postalCode') || undefined,
      country: this.extractTag(xml, 'country') || undefined,
      tvaNumber: this.extractTag(xml, 'tvaNumber') || undefined,
      notes: this.extractTag(xml, 'notes') || undefined,
      isActive: this.extractTag(xml, 'isActive') !== 'false',
      createdAt: this.extractTag(xml, 'createdAt'),
      updatedAt: this.extractTag(xml, 'updatedAt'),
    };
  }

  private supplierToXml(s: Supplier): string {
    let x = '  <supplier>\n';
    x += `    ${this.createTag('id', s.id)}\n`;
    x += `    ${this.createTag('name', s.name)}\n`;
    if (s.contactName) x += `    ${this.createTag('contactName', s.contactName)}\n`;
    x += `    ${this.createTag('email', s.email)}\n`;
    x += `    ${this.createTag('phone', s.phone)}\n`;
    if (s.address) x += `    ${this.createTag('address', s.address)}\n`;
    if (s.city) x += `    ${this.createTag('city', s.city)}\n`;
    if (s.postalCode) x += `    ${this.createTag('postalCode', s.postalCode)}\n`;
    if (s.country) x += `    ${this.createTag('country', s.country)}\n`;
    if (s.tvaNumber) x += `    ${this.createTag('tvaNumber', s.tvaNumber)}\n`;
    if (s.notes) x += `    ${this.createTag('notes', s.notes)}\n`;
    x += `    ${this.createTag('isActive', s.isActive)}\n`;
    x += `    ${this.createTag('createdAt', s.createdAt)}\n`;
    x += `    ${this.createTag('updatedAt', s.updatedAt)}\n`;
    x += '  </supplier>';
    return x;
  }

  private async saveAll(list: Supplier[]): Promise<void> {
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<suppliers>\n' + list.map(s => this.supplierToXml(s)).join('\n') + '\n</suppliers>';
    await this.writeXmlFile(this.filename, xml);
  }
}

export const supplierService = new SupplierService();
