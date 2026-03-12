import { BaseXmlService } from '@/lib/xml/BaseXmlService';
import { AppSettings, UpdateSettingsInput } from '@/lib/types/settings';

const DEFAULT_SETTINGS: Omit<AppSettings, 'id' | 'updatedAt'> = {
  companyName: 'Pâtisserie Mme Daoud',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  tvaNumber: '',
  tvaRate: 19,
  currency: 'TND',
  currencySymbol: 'DT',
};

export class SettingsService extends BaseXmlService {
  private filename = 'settings.xml';

  async get(): Promise<AppSettings> {
    const content = await this.readXmlFile(this.filename);
    if (!content) {
      const now = this.getCurrentTimestamp();
      const defaultSettings: AppSettings = {
        id: 'default',
        ...DEFAULT_SETTINGS,
        updatedAt: now,
      };
      await this.save(defaultSettings);
      return defaultSettings;
    }
    const block = content.match(/<settings>([\s\S]*?)<\/settings>/);
    if (!block) {
      const now = this.getCurrentTimestamp();
      return { id: 'default', ...DEFAULT_SETTINGS, updatedAt: now };
    }
    const xml = block[1];
    return {
      id: this.extractTag(xml, 'id') || 'default',
      companyName: this.extractTag(xml, 'companyName') || DEFAULT_SETTINGS.companyName,
      companyAddress: this.extractTag(xml, 'companyAddress') || '',
      companyPhone: this.extractTag(xml, 'companyPhone') || '',
      companyEmail: this.extractTag(xml, 'companyEmail') || '',
      tvaNumber: this.extractTag(xml, 'tvaNumber') || '',
      tvaRate: parseFloat(this.extractTag(xml, 'tvaRate')) || DEFAULT_SETTINGS.tvaRate,
      currency: this.extractTag(xml, 'currency') || DEFAULT_SETTINGS.currency,
      currencySymbol: this.extractTag(xml, 'currencySymbol') || DEFAULT_SETTINGS.currencySymbol,
      updatedAt: this.extractTag(xml, 'updatedAt') || this.getCurrentTimestamp(),
    };
  }

  async save(settings: AppSettings): Promise<AppSettings> {
    settings.updatedAt = this.getCurrentTimestamp();
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<settings>\n' + this.settingsToXml(settings) + '\n</settings>';
    await this.writeXmlFile(this.filename, xml);
    return settings;
  }

  async update(input: UpdateSettingsInput): Promise<AppSettings> {
    const current = await this.get();
    const updated: AppSettings = {
      ...current,
      ...input,
      updatedAt: this.getCurrentTimestamp(),
    };
    return this.save(updated);
  }

  private settingsToXml(s: AppSettings): string {
    let x = '  ';
    x += this.createTag('id', s.id) + '\n  ';
    x += this.createTag('companyName', s.companyName) + '\n  ';
    x += this.createTag('companyAddress', s.companyAddress || '') + '\n  ';
    x += this.createTag('companyPhone', s.companyPhone || '') + '\n  ';
    x += this.createTag('companyEmail', s.companyEmail || '') + '\n  ';
    x += this.createTag('tvaNumber', s.tvaNumber || '') + '\n  ';
    x += this.createTag('tvaRate', s.tvaRate) + '\n  ';
    x += this.createTag('currency', s.currency) + '\n  ';
    x += this.createTag('currencySymbol', s.currencySymbol) + '\n  ';
    x += this.createTag('updatedAt', s.updatedAt);
    return x;
  }
}

export const settingsService = new SettingsService();
