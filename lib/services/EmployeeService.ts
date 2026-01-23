import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '@/lib/types/employee';

/**
 * Service de gestion des employés en XML
 */
export class EmployeeService extends BaseXmlService {
    private filename = 'employees.xml';

    /**
     * Récupère tous les employés
     */
    async getAll(): Promise<Employee[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const blocks = this.extractAllTags(content, 'employee');
        return blocks.map(block => this.parseEmployee(block)).filter(e => e !== null) as Employee[];
    }

    /**
     * Récupère un employé par ID
     */
    async getById(id: string): Promise<Employee | null> {
        const employees = await this.getAll();
        return employees.find(e => e.id === id) || null;
    }

    /**
     * Crée un nouvel employé
     */
    async create(input: CreateEmployeeInput): Promise<Employee> {
        const employees = await this.getAll();
        const now = this.getCurrentTimestamp();

        const newEmployee: Employee = {
            id: this.generateId(),
            lastName: input.lastName,
            firstName: input.firstName,
            cin: input.cin,
            phone: input.phone,
            address: input.address,
            position: input.position,
            amount: input.amount,
            hireDate: input.hireDate,
            isActive: true,
            createdAt: now,
            updatedAt: now
        };

        employees.push(newEmployee);
        await this.saveAll(employees);

        return newEmployee;
    }

    /**
     * Met à jour un employé
     */
    async update(id: string, input: UpdateEmployeeInput): Promise<Employee | null> {
        const employees = await this.getAll();
        const index = employees.findIndex(e => e.id === id);

        if (index === -1) return null;

        const updated: Employee = {
            ...employees[index],
            ...input,
            updatedAt: this.getCurrentTimestamp()
        };

        employees[index] = updated;
        await this.saveAll(employees);

        return updated;
    }

    /**
     * Supprime un employé
     */
    async delete(id: string): Promise<boolean> {
        const employees = await this.getAll();
        const index = employees.findIndex(e => e.id === id);

        if (index === -1) return false;

        employees.splice(index, 1);
        await this.saveAll(employees);

        return true;
    }

    /**
     * Parse un bloc XML employé
     */
    private parseEmployee(xml: string): Employee | null {
        const id = this.extractTag(xml, 'id');
        if (!id) return null;

        return {
            id,
            lastName: this.extractTag(xml, 'lastName'),
            firstName: this.extractTag(xml, 'firstName'),
            cin: this.extractTag(xml, 'cin'),
            phone: this.extractTag(xml, 'phone'),
            address: this.extractTag(xml, 'address'),
            position: this.extractTag(xml, 'position'),
            amount: parseFloat(this.extractTag(xml, 'amount')) || 0,
            hireDate: this.extractTag(xml, 'hireDate'),
            isActive: this.extractTag(xml, 'isActive') !== 'false',
            createdAt: this.extractTag(xml, 'createdAt'),
            updatedAt: this.extractTag(xml, 'updatedAt')
        };
    }

    /**
     * Convertit un employé en XML
     */
    private employeeToXml(employee: Employee): string {
        let xml = '  <employee>\n';
        xml += `    ${this.createTag('id', employee.id)}\n`;
        xml += `    ${this.createTag('lastName', employee.lastName)}\n`;
        xml += `    ${this.createTag('firstName', employee.firstName)}\n`;
        xml += `    ${this.createTag('cin', employee.cin)}\n`;
        xml += `    ${this.createTag('phone', employee.phone)}\n`;
        xml += `    ${this.createTag('address', employee.address)}\n`;
        xml += `    ${this.createTag('position', employee.position)}\n`;
        xml += `    ${this.createTag('amount', employee.amount)}\n`;
        xml += `    ${this.createTag('hireDate', employee.hireDate)}\n`;
        xml += `    ${this.createTag('isActive', employee.isActive)}\n`;
        xml += `    ${this.createTag('createdAt', employee.createdAt)}\n`;
        xml += `    ${this.createTag('updatedAt', employee.updatedAt)}\n`;
        xml += '  </employee>';
        return xml;
    }

    /**
     * Sauvegarde tous les employés
     */
    private async saveAll(employees: Employee[]): Promise<void> {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<employees>\n';
        xml += employees.map(e => this.employeeToXml(e)).join('\n');
        xml += '\n</employees>';

        await this.writeXmlFile(this.filename, xml);
    }
}

export const employeeService = new EmployeeService();
