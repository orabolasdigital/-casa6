/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de CRM & Repositório Central de Cadastros (Coração do Sistema)
 * Coleção Firestore: 'crm_contatos'
 */

import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';
import importedContactsData from '../data/imported_crm_contacts.json';
import {
  calculateAge,
  calculateAstroProfile,
  cleanPhone,
  inferGender,
  MONTH_NAMES,
  parseDate
} from '../utils/astroEngine';

export interface CRMContactDetail {
  id: string;
  nome: string;
  sobrenome: string;
  fullName: string;
  apelido: string;
  genero: 'Feminino' | 'Masculino';
  idade?: number;
  ddd: string;
  telefone: string;
  whatsapp: string;
  email: string;
  dataNascimento: string;
  mesNascimento: string;
  mesNumero?: number;
  diaNascimento: string;
  anoNascimento: string;
  horarioNascimento: string;
  cidade: string;
  uf: string;
  sol: string;
  lua: string;
  ascendente: string;
  venus: string;
  marte: string;
  quiron: string;
  jupiter: string;
  saturno: string;
  meioDoCeu: string;
  patotaStatus: 'Ativo' | 'Inativo' | 'Não Assinante';
  patotaAssinatura: 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual' | 'Bonificado' | '—';
  patotaValor?: string;
  dataCadastro: string;
  ultimoAcesso: string;
  tags: string[];
  totalInvested: number;
  notes: string;
  servicesHistory?: {
    id: string;
    serviceName: string;
    date: string;
    amount: number;
    status: 'concluido' | 'em_andamento' | 'agendado';
  }[];
  status?: 'ativo' | 'em_atendimento' | 'concluido' | 'inativo';
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_CRM_KEY = 'casa6_crm_master_contacts_v2';

// Normaliza o contato para garantir que idade e campos derivados estejam sempre frescos
export function normalizeContact(contact: any): CRMContactDetail {
  const nome = contact.nome || contact.firstName || (contact.fullName ? contact.fullName.split(' ')[0] : 'Cliente');
  const sobrenome = contact.sobrenome || contact.lastName || (contact.fullName ? contact.fullName.split(' ').slice(1).join(' ') : '');
  const fullName = contact.fullName || `${nome} ${sobrenome}`.trim();
  const apelido = contact.apelido || nome;
  const genero = (contact.genero as 'Feminino' | 'Masculino') || inferGender(nome);

  // Recalcula idade dinamicamente a partir da data de nascimento
  const dataNascimento = contact.dataNascimento || '';
  const parsedDate = parseDate(dataNascimento);
  let idade = contact.idade;
  let mesNascimento = contact.mesNascimento || '';
  let mesNumero = contact.mesNumero;
  let diaNascimento = contact.diaNascimento || '';
  let anoNascimento = contact.anoNascimento || '';

  if (parsedDate) {
    idade = calculateAge(parsedDate.day, parsedDate.month, parsedDate.year);
    mesNascimento = MONTH_NAMES[parsedDate.month - 1] || mesNascimento;
    mesNumero = parsedDate.month;
    diaNascimento = String(parsedDate.day).padStart(2, '0');
    anoNascimento = String(parsedDate.year);
  }

  const phoneInfo = cleanPhone(contact.ddd, contact.telefone || contact.whatsapp);

  return {
    id: contact.id || `crm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    nome,
    sobrenome,
    fullName,
    apelido,
    genero,
    idade,
    ddd: contact.ddd || phoneInfo.ddd,
    telefone: contact.telefone || phoneInfo.telefone,
    whatsapp: contact.whatsapp || phoneInfo.whatsapp,
    email: (contact.email || '').toLowerCase().trim(),
    dataNascimento,
    mesNascimento,
    mesNumero,
    diaNascimento,
    anoNascimento,
    horarioNascimento: contact.horarioNascimento || '',
    cidade: contact.cidade || contact.city || '',
    uf: (contact.uf || contact.state || '').toUpperCase(),
    sol: contact.sol || '',
    lua: contact.lua || '',
    ascendente: contact.ascendente || '',
    venus: contact.venus || '',
    marte: contact.marte || '',
    quiron: contact.quiron || '',
    jupiter: contact.jupiter || '',
    saturno: contact.saturno || '',
    meioDoCeu: contact.meioDoCeu || '',
    patotaStatus: contact.patotaStatus || 'Não Assinante',
    patotaAssinatura: contact.patotaAssinatura || '—',
    patotaValor: contact.patotaValor || '',
    dataCadastro: contact.dataCadastro || contact.createdAt || '2025/2026',
    ultimoAcesso: contact.ultimoAcesso || '',
    tags: Array.isArray(contact.tags) ? contact.tags : [],
    totalInvested: Number(contact.totalInvested) || 0,
    notes: contact.notes || '',
    servicesHistory: Array.isArray(contact.servicesHistory) ? contact.servicesHistory : [],
    status: contact.status || 'ativo',
    createdAt: contact.createdAt || new Date().toISOString(),
    updatedAt: contact.updatedAt || new Date().toISOString()
  };
}

export async function getCRMContactsList(): Promise<CRMContactDetail[]> {
  // 1. Tentar Firestore se estiver conectado
  if (isFirebaseReady && db) {
    try {
      const snapshot = await getDocs(collection(db, 'crm_contatos'));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => normalizeContact(d.data()));
      }
    } catch (err) {
      console.warn('[CRMService] Falha de conexão Firestore, usando repositório local:', err);
    }
  }

  // 2. Cache LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CRM_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeContact);
        }
      }
    } catch {
      // Ignora erro de storage
    }
  }

  // 3. Importação Inicial (1.100 contatos do arquivo da Casa 6)
  const initialList = (importedContactsData as any[]).map(normalizeContact);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_CRM_KEY, JSON.stringify(initialList));
    } catch {
      // Storage pode estar com cota reduzida no navegador
    }
  }

  return initialList;
}

export async function saveCRMContactDetail(contact: Partial<CRMContactDetail>): Promise<CRMContactDetail> {
  const currentList = await getCRMContactsList();
  const now = new Date().toISOString();
  const id = contact.id || `crm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Auto-cálculo de astrologia e idade caso tenha data/hora de nascimento
  let astroProfile: any = {};
  if (contact.dataNascimento) {
    astroProfile = calculateAstroProfile(contact.dataNascimento, contact.horarioNascimento);
  }

  const nome = contact.nome || (contact.fullName ? contact.fullName.split(' ')[0] : 'Cliente');
  const sobrenome = contact.sobrenome || (contact.fullName ? contact.fullName.split(' ').slice(1).join(' ') : '');
  const fullName = contact.fullName || `${nome} ${sobrenome}`.trim();
  const apelido = contact.apelido || nome;
  const genero = contact.genero || inferGender(nome);

  const phoneInfo = cleanPhone(contact.ddd, contact.telefone || contact.whatsapp);

  const mergedContact: CRMContactDetail = {
    id,
    nome,
    sobrenome,
    fullName,
    apelido,
    genero,
    idade: astroProfile.idade !== undefined ? astroProfile.idade : contact.idade,
    ddd: contact.ddd || phoneInfo.ddd,
    telefone: contact.telefone || phoneInfo.telefone,
    whatsapp: contact.whatsapp || phoneInfo.whatsapp,
    email: (contact.email || '').toLowerCase().trim(),
    dataNascimento: contact.dataNascimento || '',
    mesNascimento: contact.mesNascimento || astroProfile.mesNascimento || '',
    mesNumero: contact.mesNumero || astroProfile.mesNumero,
    diaNascimento: contact.diaNascimento || astroProfile.diaNascimento || '',
    anoNascimento: contact.anoNascimento || astroProfile.anoNascimento || '',
    horarioNascimento: contact.horarioNascimento || '',
    cidade: contact.cidade || '',
    uf: (contact.uf || '').toUpperCase(),
    sol: contact.sol || astroProfile.sol || '',
    lua: contact.lua || astroProfile.lua || '',
    ascendente: contact.ascendente || astroProfile.ascendente || '',
    venus: contact.venus || astroProfile.venus || '',
    marte: contact.marte || astroProfile.marte || '',
    quiron: contact.quiron || astroProfile.quiron || '',
    jupiter: contact.jupiter || astroProfile.jupiter || '',
    saturno: contact.saturno || astroProfile.saturno || '',
    meioDoCeu: contact.meioDoCeu || astroProfile.meioDoCeu || '',
    patotaStatus: contact.patotaStatus || 'Não Assinante',
    patotaAssinatura: contact.patotaAssinatura || '—',
    patotaValor: contact.patotaValor || '',
    dataCadastro: contact.dataCadastro || new Date().toLocaleDateString('pt-BR'),
    ultimoAcesso: contact.ultimoAcesso || '',
    tags: Array.isArray(contact.tags) ? contact.tags : ['Novo Cadastro'],
    totalInvested: Number(contact.totalInvested) || 0,
    notes: contact.notes || '',
    servicesHistory: Array.isArray(contact.servicesHistory) ? contact.servicesHistory : [],
    status: contact.status || 'ativo',
    createdAt: contact.createdAt || now,
    updatedAt: now
  };

  const normalized = normalizeContact(mergedContact);

  if (isFirebaseReady && db) {
    try {
      await setDoc(doc(db, 'crm_contatos', id), normalized, { merge: true });
    } catch (err) {
      console.warn('[CRMService] Erro ao salvar no Firestore:', err);
    }
  }

  const existingIndex = currentList.findIndex((c) => c.id === id);
  let updatedList: CRMContactDetail[];
  if (existingIndex >= 0) {
    updatedList = [...currentList];
    updatedList[existingIndex] = normalized;
  } else {
    updatedList = [normalized, ...currentList];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_CRM_KEY, JSON.stringify(updatedList));
    } catch {
      // Ignora erro
    }
  }

  return normalized;
}

export async function deleteCRMContactDetail(id: string): Promise<void> {
  const currentList = await getCRMContactsList();
  const filtered = currentList.filter((c) => c.id !== id);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_CRM_KEY, JSON.stringify(filtered));
    } catch {
      // Ignora
    }
  }

  if (isFirebaseReady && db) {
    try {
      await deleteDoc(doc(db, 'crm_contatos', id));
    } catch (err) {
      console.warn('[CRMService] Erro ao deletar no Firestore:', err);
    }
  }
}
