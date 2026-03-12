/**
 * Types pour la configuration de l'application (Paramètres)
 */

export interface AppSettings {
  id: string;
  companyName: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  tvaNumber?: string;
  tvaRate: number; // ex: 19 pour 19%
  currency: string; // ex: TND, EUR
  currencySymbol: string; // ex: د.ت, €
  updatedAt: string;
}

export interface UpdateSettingsInput {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  tvaNumber?: string;
  tvaRate?: number;
  currency?: string;
  currencySymbol?: string;
}
