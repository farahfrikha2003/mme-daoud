import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Customer, CustomerSafe, RegisterInput } from '@/lib/types/customer';

export class CustomerService extends BaseXmlService {
    private filename = 'customers.xml';

    async getAll(): Promise<Customer[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const blocks = this.extractAllTags(content, 'customer');
        return blocks.map(block => {
            return {
                id: this.extractTag(block, 'id'),
                email: this.extractTag(block, 'email'),
                username: this.extractTag(block, 'username'),
                passwordHash: this.extractTag(block, 'passwordHash'),
                firstName: this.extractTag(block, 'firstName') || undefined,
                lastName: this.extractTag(block, 'lastName') || undefined,
                phone: this.extractTag(block, 'phone') || undefined,
                address: this.extractTag(block, 'address') || undefined,
                city: this.extractTag(block, 'city') || undefined,
                zipCode: this.extractTag(block, 'zipCode') || undefined,
                createdAt: this.extractTag(block, 'createdAt'),
                updatedAt: this.extractTag(block, 'updatedAt'),
                lastLogin: this.extractTag(block, 'lastLogin') || undefined,
                isActive: this.extractTag(block, 'isActive') === 'true'
            };
        });
    }

    async getById(id: string): Promise<CustomerSafe | null> {
        const customers = await this.getAll();
        const customer = customers.find(c => c.id === id);
        if (!customer) return null;
        return this.toSafe(customer);
    }

    async getByEmail(email: string): Promise<Customer | null> {
        const customers = await this.getAll();
        return customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
    }

    async register(input: RegisterInput): Promise<CustomerSafe> {
        const customers = await this.getAll();

        if (customers.find(c => c.email.toLowerCase() === input.email.toLowerCase())) {
            throw new Error('Cet email est déjà utilisé');
        }

        const now = this.getCurrentTimestamp();
        const newCustomer: Customer = {
            id: this.generateId(),
            email: input.email,
            username: input.username || input.email.split('@')[0],
            passwordHash: input.password, // Simulation: on stocke tel quel pour la démo
            firstName: input.firstName,
            lastName: input.lastName,
            createdAt: now,
            updatedAt: now,
            isActive: true
        };

        customers.push(newCustomer);
        await this.saveAll(customers);
        return this.toSafe(newCustomer);
    }

    async update(id: string, updates: Partial<Customer>): Promise<CustomerSafe | null> {
        const customers = await this.getAll();
        const index = customers.findIndex(c => c.id === id);
        if (index === -1) return null;

        customers[index] = {
            ...customers[index],
            ...updates,
            updatedAt: this.getCurrentTimestamp()
        };

        await this.saveAll(customers);
        return this.toSafe(customers[index]);
    }

    async delete(id: string): Promise<boolean> {
        const customers = await this.getAll();
        const initialLength = customers.length;
        const filtered = customers.filter(c => c.id !== id);

        if (filtered.length === initialLength) return false;

        await this.saveAll(filtered);
        return true;
    }

    private toSafe(customer: Customer): CustomerSafe {
        const { passwordHash, ...safe } = customer;
        return safe;
    }

    private async saveAll(customers: Customer[]): Promise<void> {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<customers>\n';
        xml += customers.map(c => this.customerToXml(c)).join('\n');
        xml += '\n</customers>';
        await this.writeXmlFile(this.filename, xml);
    }

    private customerToXml(c: Customer): string {
        let xml = '  <customer>\n';
        xml += `    ${this.createTag('id', c.id)}\n`;
        xml += `    ${this.createTag('email', c.email)}\n`;
        xml += `    ${this.createTag('username', c.username)}\n`;
        xml += `    ${this.createTag('passwordHash', c.passwordHash)}\n`;
        if (c.firstName) xml += `    ${this.createTag('firstName', c.firstName)}\n`;
        if (c.lastName) xml += `    ${this.createTag('lastName', c.lastName)}\n`;
        if (c.phone) xml += `    ${this.createTag('phone', c.phone)}\n`;
        if (c.address) xml += `    ${this.createTag('address', c.address)}\n`;
        if (c.city) xml += `    ${this.createTag('city', c.city)}\n`;
        if (c.zipCode) xml += `    ${this.createTag('zipCode', c.zipCode)}\n`;
        xml += `    ${this.createTag('createdAt', c.createdAt)}\n`;
        xml += `    ${this.createTag('updatedAt', c.updatedAt)}\n`;
        if (c.lastLogin) xml += `    ${this.createTag('lastLogin', c.lastLogin)}\n`;
        xml += `    ${this.createTag('isActive', c.isActive)}\n`;
        xml += '  </customer>';
        return xml;
    }
}

export const customerService = new CustomerService();
