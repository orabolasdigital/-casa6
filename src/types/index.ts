/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Modelos de Domínio, Tipos Oficiais e Estruturas de Dados (Etapa 1 - Fundação Congelada)
 */

export type TechnicalStatus = 'REAL' | 'CONFIGURADO' | 'TESTADO' | 'PREPARADO' | 'MOCK' | 'PENDENTE';

export type UserRole = 'admin' | 'editor';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'lost';

export type DeviceCategory = 'mobile' | 'tablet' | 'desktop' | 'unknown';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  whatsapp: string;
  serviceId: string;
  serviceName: string;
  sourcePage: string;
  sourceUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  deviceCategory: DeviceCategory;
  status: LeadStatus;
  assignedTo?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Entrada estrita do Formulário Global de Agendamento.
 * Regra: Contém EXCLUSIVAMENTE estes 5 campos. Sem mensagem livre ou observações.
 */
export interface LeadFormInput {
  firstName: string;
  lastName: string;
  whatsapp: string;
  email: string;
  serviceId: string;
}

export type ServiceCategory = 'continuo' | 'unicos' | 'combos' | 'astrologia_principal' | 'recorrente' | 'complementar';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category: ServiceCategory;
  categoryGroup?: 'continuo' | 'unicos' | 'combos';
  tarotImage?: string;
  isPrimary: boolean;
  order: number;
  isActive: boolean;
  badge?: string;
}

export interface PatotaPlan {
  id: string;
  title: string;
  frequency: 'mensal' | 'semestral' | 'anual';
  highlights: string[];
  isActive: boolean;
}

export interface ExperienceItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  dateInfo: string;
  location: string;
  status: 'prevista' | 'aberta' | 'encerrada';
}

export interface LectureItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  format: 'presencial' | 'online' | 'corporativo';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorBio: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
}

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  type: 'digital' | 'fisico' | 'acesso';
  shortDescription: string;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  serviceTitle: string;
  content: string;
  isFeatured: boolean;
}

export interface SiteConfiguration {
  brandName: string;
  commercialName: string;
  tagline: string;
  founderName: string;
  founderTitle: string;
  whatsappNumberFormatted: string;
  whatsappNumberRaw: string;
  emailContact: string;
  instagramHandle: string;
  instagramUrl: string;
  instagramBiancaHandle: string;
  instagramBiancaUrl: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  operatingRegion: string;
  legalNotice: string;
  developerCreditText: string;
  developerCreditUrl: string;
}

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  section: string;
  isAdmin: boolean;
  showInNav?: boolean;
  navLabel?: string;
}

export type AnalyticsEventName =
  | 'page_view'
  | 'view_service'
  | 'open_booking'
  | 'submit_booking'
  | 'whatsapp_click'
  | 'patota_view'
  | 'patota_click'
  | 'view_product'
  | 'blog_view'
  | 'lecture_lead'
  | 'bussula_lead'
  | 'checkout_start'
  | 'checkout_complete';

export interface AnalyticsPayload {
  eventName: AnalyticsEventName;
  timestamp: string;
  page: string;
  properties?: Record<string, unknown>;
}

export interface BirthData {
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  birthHour: string;
  birthMinute: string;
  city: string;
  state: string;
}

export interface BussulaOrderInput {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  birthData: BirthData;
}

export interface PatotaSubscriptionInput {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  birthData: BirthData;
}

export interface MemberAccount {
  id: string;
  email: string;
  cpf: string;
  fullName: string;
  whatsapp: string;
  createdAt: string;
}

export interface ShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  memberEmail: string;
  memberCpf: string;
  customerName: string;
  whatsapp: string;
  serviceType: 'bussula' | 'patota' | 'loja' | 'atendimento';
  itemTitle: string;
  amount: number;
  status: 'approved' | 'pending' | 'in_process';
  paymentMethod: 'pix' | 'credit_card' | 'ticket';
  mpPaymentId?: string;
  voucherCode?: string;
  bonusConsumacao?: string;
  birthData?: BirthData;
  shippingAddress?: ShippingAddress;
  reportHtml?: string;
  pdfUrl?: string;
  createdAt: string;
}

