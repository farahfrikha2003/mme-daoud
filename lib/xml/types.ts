/**
 * Types et interfaces pour le système de stockage XML
 */

export interface BaseXmlData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface XmlDataItem extends BaseXmlData {
  // Champs personnalisables pour étendre les données
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Types pour les opérations CRUD
 */
export interface CreateXmlDataRequest {
  title: string;
  description: string;
  [key: string]: any;
}

export interface UpdateXmlDataRequest {
  title?: string;
  description?: string;
  [key: string]: any;
}

export interface XmlDataResponse {
  success: boolean;
  data?: XmlDataItem;
  message?: string;
}

export interface XmlDataListResponse {
  success: boolean;
  data: XmlDataItem[];
  total: number;
  message?: string;
}

/**
 * Types pour la recherche
 */
export interface SearchRequest {
  query: string;
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  success: boolean;
  data: XmlDataItem[];
  total: number;
  query: string;
  message?: string;
}

/**
 * Configuration XML
 */
export interface XmlConfig {
  autoSave: boolean;
  backupEnabled: boolean;
  maxFileSize: number; // en octets
  encoding: string;
}

/**
 * Métadonnées pour les fichiers XML
 */
export interface XmlFileMetadata {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  lastModified: string;
  checksum?: string;
}