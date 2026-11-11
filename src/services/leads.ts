/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Gerenciamento e Funil de Leads (Etapa 1 - Fundação Congelada)
 */

import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { SITE_CONFIG, OFFICIAL_SERVICES } from '../config/site';
import { DeviceCategory, Lead, LeadFormInput, LeadStatus } from '../types';
import { trackAnalyticsEvent } from './analytics';
import { db, isFirebaseReady, handleFirestoreError, OperationType } from './firebase';
import {
  validateName,
  validateWhatsAppNumber,
  validateEmailAddress,
  saveCRMContactRecord
} from './formValidation';

const LOCAL_STORAGE_LEADS_KEY = 'casa6_leads_repository';

/**
 * Detecta a categoria de dispositivo mobile-first
 */
export function detectDeviceCategory(): DeviceCategory {
  if (typeof window === 'undefined') return 'unknown';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Extrai parâmetros UTM da URL atual
 */
export function getUtmParameters(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
} {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined
  };
}

/**
 * Validação rigorosa dos 5 campos do formulário global
 * Regras:
 * - Nome e Sobrenome: apenas letras/acentos, mín 3 e máx 15 caracteres.
 * - WhatsApp: validação de DDD real brasileiro ou internacional, sem repetições fake.
 * - E-mail: sintaxe e provedores confiáveis.
 */
export function validateLeadForm(input: LeadFormInput): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const nameVal = validateName(input.firstName, 'Nome');
  if (!nameVal.isValid && nameVal.error) {
    errors.firstName = nameVal.error;
  }

  const lastNameVal = validateName(input.lastName, 'Sobrenome');
  if (!lastNameVal.isValid && lastNameVal.error) {
    errors.lastName = lastNameVal.error;
  }

  const phoneVal = validateWhatsAppNumber(input.whatsapp);
  if (!phoneVal.isValid && phoneVal.error) {
    errors.whatsapp = phoneVal.error;
  }

  const emailVal = validateEmailAddress(input.email);
  if (!emailVal.isValid && emailVal.error) {
    errors.email = emailVal.error;
  }

  if (!input.serviceId) {
    errors.serviceId = 'Selecione o tipo de atendimento desejado.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Criação e Submissão Oficial de Lead
 */
export async function submitLeadBooking(
  input: LeadFormInput,
  sourcePageTitle: string
): Promise<{ success: boolean; whatsappUrl: string; leadId: string }> {
  const validation = validateLeadForm(input);
  if (!validation.isValid) {
    const errorMsg = Object.values(validation.errors).join(' ');
    throw new Error(errorMsg);
  }

  const matchedService = OFFICIAL_SERVICES.find((s) => s.id === input.serviceId) || OFFICIAL_SERVICES[0];
  const serviceName = matchedService.title;
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();
  const utm = getUtmParameters();

  const newLead: Lead = {
    id: leadId,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    fullName: `${input.firstName.trim()} ${input.lastName.trim()}`,
    email: input.email.trim().toLowerCase(),
    whatsapp: input.whatsapp.trim(),
    serviceId: matchedService.id,
    serviceName: serviceName,
    sourcePage: sourcePageTitle,
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    ...utm,
    deviceCategory: detectDeviceCategory(),
    status: 'new',
    createdAt: now,
    updatedAt: now
  };

  // 1. Persistência de Dados (Firestore quando conectado; fallback em armazenamento local)
  if (isFirebaseReady && db) {
    try {
      const docRef = doc(db, 'leads', leadId);
      await setDoc(docRef, newLead);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `leads/${leadId}`);
    }
  } else {
    // Armazenamento local para permitir testes completos de CRM em Etapa 1
    const existing = getLocalLeads();
    existing.unshift(newLead);
    saveLocalLeads(existing);
  }

  // 1.1 Sincronização Automática na coleção de CRM (crm_contatos)
  try {
    await saveCRMContactRecord({
      firstName: newLead.firstName,
      lastName: newLead.lastName,
      fullName: newLead.fullName,
      email: newLead.email,
      whatsapp: newLead.whatsapp,
      lastSource: sourcePageTitle
    });
  } catch (crmErr) {
    console.warn('[CRM Sync Warning]', crmErr);
  }

  // 2. Disparo de Evento Analítico
  trackAnalyticsEvent('submit_booking', {
    serviceId: matchedService.id,
    serviceName: matchedService.title,
    deviceCategory: newLead.deviceCategory,
    sourcePage: sourcePageTitle
  });

  // 3. Geração Automática da Mensagem de WhatsApp oficial da Bianca Tofoli
  // Mensagem padronizada estrita conforme diretriz oficial da especificação (Requisito 19)
  const whatsappMessage = `Olá, Bianca! Vim pelo site e gostaria de agendar ${serviceName}.\n\nMeu nome é ${newLead.fullName}.`;
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumberRaw}?text=${encodeURIComponent(whatsappMessage)}`;

  return {
    success: true,
    whatsappUrl,
    leadId
  };
}

/**
 * Operações do Painel Administrativo (/painel/leads)
 */
export async function getLeadsList(): Promise<Lead[]> {
  if (isFirebaseReady && db) {
    try {
      const snapshot = await getDocs(collection(db, 'leads'));
      return snapshot.docs.map((docSnap) => docSnap.data() as Lead);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'leads');
    }
  }

  return getLocalLeads();
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  internalNotes?: string
): Promise<void> {
  const now = new Date().toISOString();

  if (isFirebaseReady && db) {
    try {
      const docRef = doc(db, 'leads', leadId);
      const payload: Partial<Lead> = { status, updatedAt: now };
      if (internalNotes !== undefined) payload.internalNotes = internalNotes;
      await updateDoc(docRef, payload);
      return;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `leads/${leadId}`);
    }
  }

  // Fallback local
  const current = getLocalLeads();
  const index = current.findIndex((l) => l.id === leadId);
  if (index !== -1) {
    current[index] = {
      ...current[index],
      status,
      internalNotes: internalNotes !== undefined ? internalNotes : current[index].internalNotes,
      updatedAt: now
    };
    saveLocalLeads(current);
  }
}

export async function deleteLeadRecord(leadId: string): Promise<void> {
  if (isFirebaseReady && db) {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      return;
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `leads/${leadId}`);
    }
  }

  const current = getLocalLeads();
  const filtered = current.filter((l) => l.id !== leadId);
  saveLocalLeads(filtered);
}

// Utilitários de persistência local para ambiente de desenvolvimento/validação
function getLocalLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
  } catch {
    // Silently continue
  }
}
