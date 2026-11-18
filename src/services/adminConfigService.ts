/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo Central de Configurações, Fluxos, Integrações e CMS do Painel
 * Coleções Firestore: 'admin_config', 'site_pages_cms', 'message_templates'
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';

export interface PaymentCredentials {
  publicKey: string;
  accessToken: string;
  webhookSecret: string;
  isSandbox: boolean;
  updatedAt: string;
}

export interface TrackingSettings {
  googleTagManagerId: string;
  googleAnalytics4Id: string;
  metaPixelId: string;
  googleAdsId: string;
  googleBusinessUrl: string;
  tiktokPixelId: string;
  twitterPixelId: string;
  customHeadScript: string;
  customBodyScript: string;
  updatedAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  category: 'agendamento' | 'bussola' | 'patota' | 'pos_consulta' | 'geral';
  content: string;
  variables: string[];
}

export interface EmailAutomationSettings {
  senderGmail: string;
  copyToBianca: boolean;
  biancaNotificationEmail: string;
  welcomeTemplateActive: boolean;
  orderNotificationActive: boolean;
  leadAlertActive: boolean;
  smtpConnected: boolean;
  updatedAt: string;
}

export interface PageCMSContent {
  slug: string;
  name: string;
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  palettePrimaryColor: string;
  paletteAccentColor: string;
  sectionsCount: number;
  customNotes?: string;
  updatedAt: string;
}

export interface LojinhaShippingConfig {
  shippingType: 'fixo' | 'km' | 'estado';
  fixedPrice: number;
  pricePerKm: number;
  stateRates: Record<string, number>;
  freeShippingAbove: number;
}

const LOCAL_STORAGE_CONFIG_KEY = 'casa6_admin_full_settings';

export const DEFAULT_PAYMENT_CONFIG: PaymentCredentials = {
  publicKey: 'APP_USR-67890-PROD-PUBLIC-KEY-CASA6',
  accessToken: 'APP_USR-12345-PROD-ACCESS-TOKEN-CASA6',
  webhookSecret: 'whsec_casa6_mercadopago_prod',
  isSandbox: false,
  updatedAt: '2026-11-18T00:00:00.000Z'
};

export const DEFAULT_TRACKING_CONFIG: TrackingSettings = {
  googleTagManagerId: 'GTM-CASA6BR',
  googleAnalytics4Id: 'G-CASA6ANALYTICS',
  metaPixelId: '123456789012345',
  googleAdsId: 'AW-987654321',
  googleBusinessUrl: 'https://g.page/casa6astrologia',
  tiktokPixelId: '',
  twitterPixelId: '',
  customHeadScript: '',
  customBodyScript: '',
  updatedAt: '2026-11-18T00:00:00.000Z'
};

export const DEFAULT_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tmpl_lembrete_consulta',
    title: 'Lembrete de Consulta (24h antes)',
    category: 'agendamento',
    content: 'Olá, {nome}! ✨ Passando para confirmar nosso encontro astrológico de {servico} amanhã, dia {data} às {horario}.\n\nNosso link do Google Meet: {link_meet}\n\nRecomendo estar em um ambiente tranquilo. Qualquer dúvida, estou por aqui! Com carinho, Bianca Tofoli — Casa 6.',
    variables: ['{nome}', '{servico}', '{data}', '{horario}', '{link_meet}']
  },
  {
    id: 'tmpl_entrega_bussola',
    title: 'Entrega da Bússola em PDF',
    category: 'bussola',
    content: 'Olá, {nome}! 🧭 Sua {bussola_tipo} calculada com base no seu mapa de nascimento já está pronta e disponível.\n\nSegue em anexo o seu PDF completo com todas as diretrizes dos trânsitos para o seu momento.\n\nVocê também já pode acessar na Área de Membros da Casa 6! Um abraço carinhoso, Bianca.',
    variables: ['{nome}', '{bussola_tipo}']
  },
  {
    id: 'tmpl_boas_vindas_patota',
    title: 'Boas-Vindas à Patota Astral',
    category: 'patota',
    content: 'Seja muito bem-vinda(o) à Patota Astral, {nome}! 🔮 É uma alegria ter você com a gente.\n\nAqui está seu link de entrada no nosso Grupo VIP do WhatsApp: {link_grupo}\n\nTodos os dias pela manhã você receberá os áudios e trânsitos da Lua. Aproveite cada ciclo!',
    variables: ['{nome}', '{link_grupo}']
  },
  {
    id: 'tmpl_pos_atendimento',
    title: 'Pós-Atendimento & Acolhimento',
    category: 'pos_consulta',
    content: 'Olá, {nome}! Como você está integrando as reflexões da nossa consulta de {servico}?\n\nLembre-se de respirar e respeitar o seu próprio tempo. A gravação e o material de apoio estão disponíveis no seu e-mail. Conte comigo na sua caminhada astral!',
    variables: ['{nome}', '{servico}']
  }
];

export const DEFAULT_EMAIL_AUTOMATION: EmailAutomationSettings = {
  senderGmail: 'consultas.casa6@gmail.com',
  copyToBianca: true,
  biancaNotificationEmail: 'bianca@casa6.com.br',
  welcomeTemplateActive: true,
  orderNotificationActive: true,
  leadAlertActive: true,
  smtpConnected: true,
  updatedAt: '2026-11-18T00:00:00.000Z'
};

export const DEFAULT_SHIPPING_CONFIG: LojinhaShippingConfig = {
  shippingType: 'fixo',
  fixedPrice: 25.0,
  pricePerKm: 1.2,
  stateRates: {
    SP: 18.0,
    RJ: 22.0,
    MG: 24.0,
    PR: 26.0,
    SC: 28.0,
    RS: 29.0,
    OUTROS: 35.0
  },
  freeShippingAbove: 299.0
};

export const DEFAULT_PAGES_CMS: Record<string, PageCMSContent> = {
  inicio: {
    slug: 'inicio',
    name: 'Página Inicial (Início)',
    heroTag: 'ASTROLOGIA • AUTOCONHECIMENTO • VIDA REAL',
    heroTitle: 'Autoconhecimento, equilíbrio e transformação para sua vida.',
    heroSubtitle: 'Descubra a Casa 6 e se conecte com a sua essência através da astrologia com um olhar lúcido e acolhedor.',
    heroImage: 'https://video.wixstatic.com/video/02c8e0_bbdf46bd6f6f4c45937fb5989df57687/720p/mp4/file.mp4',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 8,
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  sobre: {
    slug: 'sobre',
    name: 'Sobre Bianca Tofoli',
    heroTag: 'QUEM CONDUZ A CASA 6',
    heroTitle: 'Cuidar de pessoas através da lucidez dos astros.',
    heroSubtitle: 'Enfermeira pela UNESP, gestora de saúde e astróloga. Um olhar contemporâneo sobre autoconhecimento.',
    heroImage: 'https://static.wixstatic.com/media/02c8e0_eebda8070c014b7e9e29291edb53c2c7~mv2.jpg',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 5,
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  atendimentos: {
    slug: 'atendimentos',
    name: 'Atendimentos & Consultas',
    heroTag: 'CONSULTAS INDIVIDUAIS',
    heroTitle: 'Encontros Astrais Individuais com Bianca Tofoli',
    heroSubtitle: 'Pronto Socorro Astrológico, Mapa Natal, Revolução Solar e Combos personalizados.',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 6,
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  palestras: {
    slug: 'palestras',
    name: 'Palestras & Workshops Corporativos',
    heroTag: 'DESENVOLVIMENTO HUMANO & CORPORATIVO',
    heroTitle: 'Palestras & Workshops Corporativos',
    heroSubtitle: 'Prevenção ao burnout e saúde psicossocial em alinhamento estrito com a NR-1.',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 5,
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  parcerias: {
    slug: 'parcerias',
    name: 'Parcerias & Permutas Comerciais',
    heroTag: 'CONEXÕES COM PROPÓSITO',
    heroTitle: 'Parcerias & Permutas Estratégicas',
    heroSubtitle: 'Conecte sua marca a um público consciente: publicidade, permutas, co-branding e eventos.',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 4,
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  bussola: {
    slug: 'bussola',
    name: 'Bússolas Astrológicas',
    heroTag: 'FAMÍLIA DE BÚSSOLAS ASTROLÓGICAS',
    heroTitle: 'O céu aponta caminhos. O autoconhecimento ajuda você a escolher a direção.',
    heroSubtitle: 'Bússolas Profissional, Amorosa, Pessoal e Materna por R$ 47,00 cada em PDF no WhatsApp.',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 6,
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  patota: {
    slug: 'patota',
    name: 'Patota Astral (Comunidade)',
    heroTag: 'ASTROLOGIA DIÁRIA POR ASSINATURA',
    heroTitle: 'Apenas R$ 1,50 por dia!',
    heroSubtitle: 'Grupo VIP com áudios matinais no WhatsApp, encontros ao vivo mensais e rituais de lunação.',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 6,
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  leituras: {
    slug: 'leituras',
    name: 'Leituras & Caderno Astral',
    heroTag: 'CADERNO ASTRAL • EDITORIAL',
    heroTitle: 'Leituras Astrais',
    heroSubtitle: 'Reflexões, trânsitos astrológicos e ensaios lúcidos de Bianca Tofoli.',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 4,
    updatedAt: '2026-11-18T00:00:00.000Z'
  },
  lojinha: {
    slug: 'lojinha',
    name: 'Lojinha Casa 6',
    heroTag: 'LOJINHA OFICIAL CASA 6 • RITUAIS & OBJETOS',
    heroTitle: 'Edições Limitadas',
    heroSubtitle: 'Curadorias rituais, Box Semeadura e amuletos desenhados para materializar os ciclos.',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 5,
    updatedAt: '2026-11-18T00:00:00.000Z'
  }
};

/**
 * Lê todas as configurações centralizadas
 */
export async function getAdminAllSettings(): Promise<{
  payment: PaymentCredentials;
  tracking: TrackingSettings;
  templates: WhatsAppTemplate[];
  emailAutomation: EmailAutomationSettings;
  shipping: LojinhaShippingConfig;
  pagesCMS: Record<string, PageCMSContent>;
}> {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Ignora erro
    }
  }

  const initial = {
    payment: DEFAULT_PAYMENT_CONFIG,
    tracking: DEFAULT_TRACKING_CONFIG,
    templates: DEFAULT_WHATSAPP_TEMPLATES,
    emailAutomation: DEFAULT_EMAIL_AUTOMATION,
    shipping: DEFAULT_SHIPPING_CONFIG,
    pagesCMS: DEFAULT_PAGES_CMS
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(initial));
  }

  return initial;
}

/**
 * Salva as configurações parciais
 */
export async function saveAdminSettingsSection<K extends 'payment' | 'tracking' | 'templates' | 'emailAutomation' | 'shipping' | 'pagesCMS'>(
  section: K,
  data: any
): Promise<void> {
  const all = await getAdminAllSettings();
  all[section] = data;

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(all));
  }

  if (isFirebaseReady && db) {
    try {
      await setDoc(doc(db, 'admin_config', section), { data, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn(`[AdminConfig] Erro ao sincronizar ${section} no Firestore:`, err);
    }
  }
}

// Helpers individuais para componentes
export async function getPaymentCredentials(): Promise<PaymentCredentials> {
  const all = await getAdminAllSettings();
  return all.payment || DEFAULT_PAYMENT_CONFIG;
}

export async function savePaymentCredentials(payment: PaymentCredentials): Promise<void> {
  await saveAdminSettingsSection('payment', payment);
}

export async function getTrackingSettings(): Promise<TrackingSettings> {
  const all = await getAdminAllSettings();
  return all.tracking || DEFAULT_TRACKING_CONFIG;
}

export async function saveTrackingSettings(tracking: TrackingSettings): Promise<void> {
  await saveAdminSettingsSection('tracking', tracking);
}

export async function getWhatsAppTemplates(): Promise<WhatsAppTemplate[]> {
  const all = await getAdminAllSettings();
  return all.templates || DEFAULT_WHATSAPP_TEMPLATES;
}

export async function saveWhatsAppTemplates(templates: WhatsAppTemplate[]): Promise<void> {
  await saveAdminSettingsSection('templates', templates);
}

export async function getEmailAutomationSettings(): Promise<EmailAutomationSettings> {
  const all = await getAdminAllSettings();
  return all.emailAutomation || DEFAULT_EMAIL_AUTOMATION;
}

export async function saveEmailAutomationSettings(emailAutomation: EmailAutomationSettings): Promise<void> {
  await saveAdminSettingsSection('emailAutomation', emailAutomation);
}

export async function getLojinhaShippingConfig(): Promise<LojinhaShippingConfig> {
  const all = await getAdminAllSettings();
  return all.shipping || DEFAULT_SHIPPING_CONFIG;
}

export async function saveLojinhaShippingConfig(shipping: LojinhaShippingConfig): Promise<void> {
  await saveAdminSettingsSection('shipping', shipping);
}

export async function getPagesCMSList(): Promise<PageCMSContent[]> {
  const all = await getAdminAllSettings();
  const pagesRecord = all.pagesCMS || DEFAULT_PAGES_CMS;
  return Object.values(pagesRecord);
}

export async function savePageCMSContent(page: PageCMSContent): Promise<void> {
  const all = await getAdminAllSettings();
  const pages = { ...all.pagesCMS, [page.slug]: page };
  await saveAdminSettingsSection('pagesCMS', pages);
}

export async function restorePageCMSDefault(slug: string): Promise<PageCMSContent> {
  const defaultPage = DEFAULT_PAGES_CMS[slug] || {
    slug,
    name: slug,
    heroTag: 'CASA 6',
    heroTitle: 'Título Oficial',
    heroSubtitle: 'Subtítulo',
    palettePrimaryColor: '#2B2566',
    paletteAccentColor: '#F0B55E',
    sectionsCount: 4,
    updatedAt: new Date().toISOString()
  };
  await savePageCMSContent(defaultPage);
  return defaultPage;
}

