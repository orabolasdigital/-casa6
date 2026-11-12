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
  const utms: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  } = {};
  const s = params.get('utm_source'); if (s) utms.utmSource = s;
  const m = params.get('utm_medium'); if (m) utms.utmMedium = m;
  const c = params.get('utm_campaign'); if (c) utms.utmCampaign = c;
  const ct = params.get('utm_content'); if (ct) utms.utmContent = ct;
  const t = params.get('utm_term'); if (t) utms.utmTerm = t;
  return utms;
}

/**
 * Regra oficial de gravação no banco de dados para Nome e Sobrenome:
 * - Nome (firstName): Sempre a primeira palavra antes do primeiro espaço.
 * - Sobrenome (lastName): Todo o restante do texto após o primeiro espaço.
 */
export function parseFirstAndLastName(
  rawFullName?: string,
  rawFirst?: string,
  rawLast?: string
): { firstName: string; lastName: string; fullName: string } {
  const combined = (rawFullName || `${rawFirst || ''} ${rawLast || ''}`)
    .trim()
    .replace(/\s+/g, ' ');

  if (!combined) {
    return { firstName: '', lastName: '', fullName: '' };
  }

  const firstSpaceIndex = combined.indexOf(' ');
  if (firstSpaceIndex === -1) {
    return {
      firstName: combined,
      lastName: '',
      fullName: combined
    };
  }

  const firstName = combined.substring(0, firstSpaceIndex).trim();
  const lastName = combined.substring(firstSpaceIndex + 1).trim();

  return {
    firstName,
    lastName,
    fullName: combined
  };
}

/**
 * Validação dos campos do formulário global
 * Regras:
 * - Nome e Sobrenome: validação flexível de pelo menos 2 caracteres no nome.
 * - WhatsApp: validação de DDD real brasileiro ou internacional.
 * - E-mail: sintaxe e formato válido.
 */
export function validateLeadForm(input: LeadFormInput): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const { firstName } = parseFirstAndLastName(input.fullName, input.firstName, input.lastName);
  if (!firstName || firstName.length < 2) {
    errors.firstName = 'Informe seu nome (mínimo de 2 letras).';
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
  const serviceName = matchedService?.title || 'Atendimento Casa 6';
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();
  const utm = getUtmParameters();

  // Aplicação estrita da regra de gravação no banco de dados:
  // - Nome: sempre a primeira palavra
  // - Sobrenome: todo o restante após o primeiro espaço
  const { firstName, lastName, fullName } = parseFirstAndLastName(
    input.fullName,
    input.firstName,
    input.lastName
  );

  const newLead: Lead = {
    id: leadId,
    firstName: firstName,
    lastName: lastName,
    fullName: fullName,
    email: input.email.trim().toLowerCase(),
    whatsapp: input.whatsapp.trim(),
    serviceId: matchedService ? matchedService.id : input.serviceId,
    serviceName: serviceName,
    sourcePage: sourcePageTitle,
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    ...utm,
    deviceCategory: detectDeviceCategory(),
    status: 'new',
    createdAt: now,
    updatedAt: now
  };

  // Sanitiza para garantir que NENHUM campo com valor undefined seja enviado ao Firestore
  const sanitizedLead: Record<string, any> = {};
  for (const [key, val] of Object.entries(newLead)) {
    if (val !== undefined) {
      sanitizedLead[key] = val;
    }
  }

  // 1. Persistência de Dados (Firestore quando conectado; fallback local)
  if (isFirebaseReady && db) {
    try {
      const docRef = doc(db, 'leads', leadId);
      await setDoc(docRef, sanitizedLead);
    } catch (err) {
      console.warn('[Firestore Leads Warning]', err);
    }
  }

  // Sempre armazena também em cache local para garantir continuidade
  try {
    const existing = getLocalLeads();
    existing.unshift(sanitizedLead as Lead);
    saveLocalLeads(existing);
  } catch (storageErr) {
    console.warn('[Local Leads Storage Warning]', storageErr);
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
    serviceId: matchedService ? matchedService.id : input.serviceId,
    serviceName: serviceName,
    deviceCategory: newLead.deviceCategory,
    sourcePage: sourcePageTitle
  });

  // 3. Geração Automática da Mensagem de WhatsApp oficial da Bianca Tofoli
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
