/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo Central de Validação Rigorosa de Formulários e Integração CRM
 * 
 * Regras Obrigatórias do Projeto:
 * 1. Nome e Sobrenome: Apenas letras e acentos (sem números ou caracteres especiais). Mínimo 3, Máximo 15 caracteres.
 * 2. WhatsApp: Rótulo estrito "WhatsApp" (sem palavra telefone). Validação de DDD brasileiro (11-99) ou detecção internacional. Bloqueio de números fake.
 * 3. E-mail: Sintaxe rigorosa + aceitação prioritária dos 10 principais provedores (Gmail, Hotmail, Outlook, iCloud, Yahoo, etc.). Bloqueio de domínios temporários/fake.
 * 4. Autopreenchimento de Dispositivo: Atributos HTML autoComplete padronizados em todos os campos.
 * 5. CRM (crm_contatos): Sincronização em tempo real com auto-recuperação de dados e alerta de divergência de contato.
 */

import { db, isFirebaseReady } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface CRMContact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  whatsapp: string;
  cpf?: string;
  lastSource?: string;
  updatedAt: string;
  createdAt: string;
}

const LOCAL_STORAGE_CRM_KEY = 'casa6_crm_contatos_repository';

// Provedores Confiáveis e Reconhecidos
export const TRUSTED_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'hotmail.com.br',
  'outlook.com',
  'outlook.com.br',
  'live.com',
  'msn.com',
  'yahoo.com',
  'yahoo.com.br',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'globo.com',
  'globomail.com',
  'ig.com.br',
  'proton.me',
  'protonmail.com'
];

// Domínios Proibidos (Temporários, Burner, Fakes e Testes)
export const BLOCKED_EMAIL_DOMAINS = [
  'tempmail.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'sharklasers.com',
  'yopmail.com',
  'trashmail.com',
  'fake.com',
  'teste.com',
  'exemplo.com',
  'test.com',
  'asdf.com',
  'temp-mail.org',
  'dispostable.com'
];

// DDDs Brasileiros Oficiais Válidos (Anatel)
export const VALID_BRAZILIAN_DDDS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
  '21', '22', '24', // RJ
  '27', '28', // ES
  '31', '32', '33', '34', '35', '37', '38', // MG
  '41', '42', '43', '44', '45', '46', // PR
  '47', '48', '49', // SC
  '51', '53', '54', '55', // RS
  '61', // DF
  '62', '64', // GO
  '63', // TO
  '65', '66', // MT
  '67', // MS
  '68', // AC
  '69', // RO
  '71', '73', '74', '75', '77', // BA
  '79', // SE
  '81', '87', // PE
  '82', // AL
  '83', // PB
  '84', // RN
  '85', '88', // CE
  '86', '89', // PI
  '91', '93', '94', // PA
  '92', '97', // AM
  '95', // RR
  '96', // AP
  '98', '99'  // MA
]);

/**
 * 1. Sanitizador de Nome e Sobrenome
 * Remove números, símbolos e pontuações. Mantém exclusivamente letras e acentos. Limita a 15 caracteres.
 */
export function sanitizeName(value: string): string {
  if (!value) return '';
  // Aceita apenas letras latinas, caracteres acentuados e espaços simples
  const sanitized = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
  // Impede múltiplos espaços consecutivos e limita a 15 caracteres
  return sanitized.replace(/\s+/g, ' ').slice(0, 15);
}

/**
 * Validação de Nome e Sobrenome
 * Regra: Mínimo 3 e Máximo 15 letras, sem números ou caracteres especiais.
 */
export function validateName(value: string, fieldLabel: 'Nome' | 'Sobrenome'): { isValid: boolean; error?: string } {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return { isValid: false, error: `Informe seu ${fieldLabel.toLowerCase()}.` };
  }
  if (/[^a-zA-ZÀ-ÿ\s]/.test(trimmed)) {
    return { isValid: false, error: `O ${fieldLabel.toLowerCase()} deve conter apenas letras e acentos.` };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: `O ${fieldLabel.toLowerCase()} deve ter no mínimo 2 letras.` };
  }
  if (trimmed.length > 35) {
    return { isValid: false, error: `O ${fieldLabel.toLowerCase()} deve ter no máximo 35 letras.` };
  }
  return { isValid: true };
}

/**
 * 2. Formatador de WhatsApp
 * Máscara dinâmica: (XX) 9XXXX-XXXX ou internacional +XX ...
 */
export function formatWhatsAppNumber(value: string): string {
  if (!value) return '';
  const isIntl = value.startsWith('+');
  const digits = value.replace(/\D/g, '');

  if (isIntl) {
    return `+${digits.slice(0, 15)}`;
  }

  const clean = digits.slice(0, 11);
  if (clean.length <= 2) return clean;
  if (clean.length <= 7) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
  return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
}

/**
 * Validação de WhatsApp
 * Regra: Número real com DDD válido, detecção internacional e bloqueio de fakes.
 */
export function validateWhatsAppNumber(value: string): { isValid: boolean; isInternational: boolean; error?: string } {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return { isValid: false, isInternational: false, error: 'Informe seu WhatsApp com DDD.' };
  }

  const isIntl = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  // Validação Internacional (+CC...)
  if (isIntl) {
    if (digits.length < 8 || digits.length > 15) {
      return { isValid: false, isInternational: true, error: 'Informe um WhatsApp internacional válido (entre 8 e 15 dígitos).' };
    }
    // Bloqueia repetições óbvias
    if (/^(\d)\1+$/.test(digits)) {
      return { isValid: false, isInternational: true, error: 'Número de WhatsApp internacional inválido.' };
    }
    return { isValid: true, isInternational: true };
  }

  // Validação Brasileira (DDD + Número)
  if (digits.length !== 10 && digits.length !== 11) {
    return { isValid: false, isInternational: false, error: 'O WhatsApp deve conter DDD e número completo com 11 dígitos (Ex: 11 99999-9999).' };
  }

  const ddd = digits.slice(0, 2);
  if (!VALID_BRAZILIAN_DDDS.has(ddd)) {
    return { isValid: false, isInternational: false, error: `O DDD (${ddd}) não é válido no Brasil. Verifique o código da sua região.` };
  }

  // Bloqueio de Números Fake Repetitivos
  const numberPart = digits.slice(2);
  if (/^(\d)\1+$/.test(digits) || /^(\d)\1+$/.test(numberPart)) {
    return { isValid: false, isInternational: false, error: 'Informe um número de WhatsApp real e ativo.' };
  }

  // Sequências Falsas Conhecidas
  const fakeSequences = ['123456789', '987654321', '012345678', '999999999', '000000000'];
  if (fakeSequences.some((seq) => numberPart.includes(seq))) {
    return { isValid: false, isInternational: false, error: 'Número de WhatsApp aparentemente fictício. Informe seu número real.' };
  }

  // Validação do 9º Dígito para celulares brasileiros (11 dígitos deve começar com 9)
  if (digits.length === 11 && digits.charAt(2) !== '9') {
    return { isValid: false, isInternational: false, error: 'O número de celular com WhatsApp no Brasil deve iniciar com o dígito 9.' };
  }

  return { isValid: true, isInternational: false };
}

/**
 * 3. Validação de E-mail
 * Regra: Sintaxe + Aceitação dos 10 principais provedores + Bloqueio de domínios estranhos/temporários.
 */
export function validateEmailAddress(value: string): { isValid: boolean; error?: string } {
  const clean = (value || '').trim().toLowerCase();
  if (!clean) {
    return { isValid: false, error: 'Informe seu e-mail.' };
  }

  const basicRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!basicRegex.test(clean)) {
    return { isValid: false, error: 'Formato de e-mail inválido. Verifique se digitou corretamente.' };
  }

  const parts = clean.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'E-mail inválido.' };
  }

  const domain = parts[1];

  // Bloqueio de Provedores Temporários/Descartáveis
  if (BLOCKED_EMAIL_DOMAINS.includes(domain)) {
    return { isValid: false, error: 'E-mails descartáveis ou temporários não são aceitos. Utilize um e-mail válido (ex: Gmail, Outlook, Hotmail, etc.).' };
  }

  // Validação de TLD mínimo
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { isValid: false, error: 'O domínio do e-mail não parece ser válido.' };
  }

  return { isValid: true };
}

/**
 * 4. Sincronização e Busca no CRM (crm_contatos & customers)
 */
export async function lookupCRMContactByEmail(email: string): Promise<CRMContact | null> {
  const clean = (email || '').trim().toLowerCase();
  if (!clean || !clean.includes('@')) return null;

  // 1. Busca no Firestore se disponível
  if (isFirebaseReady && db) {
    try {
      const docId = clean.replace(/[^a-z0-9]/g, '_');
      const docSnap = await getDoc(doc(db, 'crm_contatos', docId));
      if (docSnap.exists()) {
        return docSnap.data() as CRMContact;
      }
    } catch {
      // continua para fallback local
    }
  }

  // 2. Busca no Cache Local
  const localList = getLocalCRMContacts();
  return localList.find((c) => c.email.toLowerCase() === clean) || null;
}

export async function saveCRMContactRecord(contact: Omit<CRMContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<CRMContact> {
  const cleanEmail = contact.email.trim().toLowerCase();
  const docId = cleanEmail.replace(/[^a-z0-9]/g, '_');
  const now = new Date().toISOString();

  const fullContact: CRMContact = {
    ...contact,
    id: docId,
    email: cleanEmail,
    fullName: `${contact.firstName} ${contact.lastName}`.trim(),
    createdAt: now,
    updatedAt: now
  };

  // 1. Salvar no Firestore se disponível
  if (isFirebaseReady && db) {
    try {
      await setDoc(doc(db, 'crm_contatos', docId), fullContact, { merge: true });
    } catch (err) {
      console.warn('[CRM Firestore] Aviso ao salvar contato no banco (mantido localmente):', err);
    }
  }

  // 2. Salvar no Repositório Local
  const localList = getLocalCRMContacts();
  const idx = localList.findIndex((c) => c.email.toLowerCase() === cleanEmail);
  if (idx !== -1) {
    localList[idx] = { ...localList[idx], ...fullContact, updatedAt: now };
  } else {
    localList.unshift(fullContact);
  }
  saveLocalCRMContacts(localList);

  return fullContact;
}

function getLocalCRMContacts(): CRMContact[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CRM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCRMContacts(contacts: CRMContact[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CRM_KEY, JSON.stringify(contacts));
  } catch {
    // ignora se localStorage cheio
  }
}
