import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { Admin, AdminSafe, CreateAdminInput, UpdateAdminInput, AdminRole } from '@/lib/types/admin';

/**
 * Service de gestion des administrateurs en XML
 */
export class AdminXmlService extends BaseXmlService {
    private filename = 'admins.xml';

    /**
     * Récupère tous les administrateurs
     */
    async getAll(): Promise<AdminSafe[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const adminBlocks = this.extractAllTags(content, 'admin');
        return adminBlocks.map(block => this.parseAdmin(block)).filter(a => a !== null) as AdminSafe[];
    }

    /**
     * Récupère un admin par ID
     */
    async getById(id: string): Promise<AdminSafe | null> {
        const admins = await this.getAllWithPassword();
        const admin = admins.find(a => a.id === id);
        if (!admin) return null;
        return this.toSafeAdmin(admin);
    }

    /**
     * Récupère un admin par username (avec mot de passe pour auth)
     */
    async getByUsername(username: string): Promise<Admin | null> {
        const admins = await this.getAllWithPassword();
        return admins.find(a => a.username === username) || null;
    }

    /**
     * Récupère un admin par email (avec mot de passe pour auth)
     */
    async getByEmail(email: string): Promise<Admin | null> {
        const admins = await this.getAllWithPassword();
        return admins.find(a => a.email === email) || null;
    }

    /**
     * Crée un nouvel administrateur
     */
    async create(input: CreateAdminInput, passwordHash: string): Promise<AdminSafe> {
        const admins = await this.getAllWithPassword();

        // Vérifier l'unicité
        if (admins.some(a => a.username === input.username)) {
            throw new Error('Ce nom d\'utilisateur existe déjà');
        }
        if (admins.some(a => a.email === input.email)) {
            throw new Error('Cet email existe déjà');
        }

        const now = this.getCurrentTimestamp();
        const newAdmin: Admin = {
            id: this.generateId(),
            username: input.username,
            email: input.email,
            passwordHash: passwordHash,
            role: input.role,
            firstName: input.firstName || '',
            lastName: input.lastName || '',
            isActive: true,
            createdAt: now,
            updatedAt: now
        };

        admins.push(newAdmin);
        await this.saveAll(admins);

        return this.toSafeAdmin(newAdmin);
    }

    /**
     * Met à jour un administrateur
     */
    async update(id: string, input: UpdateAdminInput, newPasswordHash?: string): Promise<AdminSafe | null> {
        const admins = await this.getAllWithPassword();
        const index = admins.findIndex(a => a.id === id);

        if (index === -1) return null;

        // Vérifier l'unicité si changement
        if (input.username && input.username !== admins[index].username) {
            if (admins.some(a => a.username === input.username && a.id !== id)) {
                throw new Error('Ce nom d\'utilisateur existe déjà');
            }
        }
        if (input.email && input.email !== admins[index].email) {
            if (admins.some(a => a.email === input.email && a.id !== id)) {
                throw new Error('Cet email existe déjà');
            }
        }

        const updated: Admin = {
            ...admins[index],
            username: input.username ?? admins[index].username,
            email: input.email ?? admins[index].email,
            role: input.role ?? admins[index].role,
            firstName: input.firstName ?? admins[index].firstName,
            lastName: input.lastName ?? admins[index].lastName,
            isActive: input.isActive ?? admins[index].isActive,
            updatedAt: this.getCurrentTimestamp()
        };

        if (newPasswordHash) {
            updated.passwordHash = newPasswordHash;
        }

        admins[index] = updated;
        await this.saveAll(admins);

        return this.toSafeAdmin(updated);
    }

    /**
     * Supprime un administrateur
     */
    async delete(id: string): Promise<boolean> {
        const admins = await this.getAllWithPassword();
        const index = admins.findIndex(a => a.id === id);

        if (index === -1) return false;

        // Ne pas supprimer le dernier super_admin
        if (admins[index].role === 'super_admin') {
            const superAdminCount = admins.filter(a => a.role === 'super_admin').length;
            if (superAdminCount <= 1) {
                throw new Error('Impossible de supprimer le dernier super administrateur');
            }
        }

        admins.splice(index, 1);
        await this.saveAll(admins);

        return true;
    }

    /**
     * Met à jour la date de dernière connexion
     */
    async updateLastLogin(id: string): Promise<void> {
        const admins = await this.getAllWithPassword();
        const index = admins.findIndex(a => a.id === id);

        if (index !== -1) {
            admins[index].lastLogin = this.getCurrentTimestamp();
            await this.saveAll(admins);
        }
    }

    /**
     * Récupère tous les admins avec mot de passe (usage interne)
     */
    private async getAllWithPassword(): Promise<Admin[]> {
        const content = await this.readXmlFile(this.filename);
        if (!content) return [];

        const adminBlocks = this.extractAllTags(content, 'admin');
        return adminBlocks.map(block => this.parseAdminWithPassword(block)).filter(a => a !== null) as Admin[];
    }

    /**
     * Parse un bloc XML admin (sans mot de passe)
     */
    private parseAdmin(xml: string): AdminSafe | null {
        const admin = this.parseAdminWithPassword(xml);
        if (!admin) return null;
        return this.toSafeAdmin(admin);
    }

    /**
     * Parse un bloc XML admin (avec mot de passe)
     */
    private parseAdminWithPassword(xml: string): Admin | null {
        const id = this.extractTag(xml, 'id');
        if (!id) return null;

        return {
            id,
            username: this.extractTag(xml, 'username'),
            email: this.extractTag(xml, 'email'),
            passwordHash: this.extractTag(xml, 'passwordHash'),
            role: this.extractTag(xml, 'role') as AdminRole || 'admin',
            firstName: this.extractTag(xml, 'firstName') || undefined,
            lastName: this.extractTag(xml, 'lastName') || undefined,
            isActive: this.extractTag(xml, 'isActive') === 'true',
            createdAt: this.extractTag(xml, 'createdAt'),
            updatedAt: this.extractTag(xml, 'updatedAt'),
            lastLogin: this.extractTag(xml, 'lastLogin') || undefined
        };
    }

    /**
     * Convertit un Admin en AdminSafe
     */
    private toSafeAdmin(admin: Admin): AdminSafe {
        const { passwordHash, ...safe } = admin;
        return safe;
    }

    /**
     * Convertit un Admin en XML
     */
    private adminToXml(admin: Admin): string {
        let xml = '  <admin>\n';
        xml += `    ${this.createTag('id', admin.id)}\n`;
        xml += `    ${this.createTag('username', admin.username)}\n`;
        xml += `    ${this.createTag('email', admin.email)}\n`;
        xml += `    ${this.createTag('passwordHash', admin.passwordHash)}\n`;
        xml += `    ${this.createTag('role', admin.role)}\n`;
        if (admin.firstName) xml += `    ${this.createTag('firstName', admin.firstName)}\n`;
        if (admin.lastName) xml += `    ${this.createTag('lastName', admin.lastName)}\n`;
        xml += `    ${this.createTag('isActive', admin.isActive)}\n`;
        xml += `    ${this.createTag('createdAt', admin.createdAt)}\n`;
        xml += `    ${this.createTag('updatedAt', admin.updatedAt)}\n`;
        if (admin.lastLogin) xml += `    ${this.createTag('lastLogin', admin.lastLogin)}\n`;
        xml += '  </admin>';
        return xml;
    }

    /**
     * Sauvegarde tous les admins
     */
    private async saveAll(admins: Admin[]): Promise<void> {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<admins>\n';
        xml += admins.map(a => this.adminToXml(a)).join('\n');
        xml += '\n</admins>';

        await this.writeXmlFile(this.filename, xml);
    }
}

export const adminService = new AdminXmlService();
