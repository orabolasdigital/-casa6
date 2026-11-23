/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de CRM & Repositório Central de Cadastros (Coração do Sistema)
 * Coleção Firestore: 'crm_contatos'
 */

import { collection, doc, setDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
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
  cadastro: string; // COLUNA INICIAL: data do último acesso ou serviço prestado para este cliente
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
  patotaWhatsAppStatus?: 'Pendente' | 'Habilitado';
  clienteDesde: string; // Data que a pessoa entrou na Patota (grupo de WhatsApp)
  ultimaEntrega: string; // Último cadastro / entrega realizada
  dataCadastro: string; // Compatibilidade legada
  ultimoAcesso: string; // Compatibilidade legada
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

export interface PatotaMilestone {
  type: '1_month' | '3_months' | '6_months' | '12_months';
  label: string;
  badgeClass: string;
  greetingMessage: string;
}

export interface PatotaTenureInfo {
  months: number;
  days: number;
  formattedText: string;
  milestone: PatotaMilestone | null;
}

export function calculatePatotaTenure(entradaStr?: string, apelidoOrNome = 'querida(o)'): PatotaTenureInfo {
  if (!entradaStr || entradaStr.trim() === '' || entradaStr === '—') {
    return {
      months: 0,
      days: 0,
      formattedText: '—',
      milestone: null
    };
  }

  let entryDate: Date | null = null;
  const parts = entradaStr.split(/[\/\-\.]/);

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      entryDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      entryDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
  } else if (parts.length === 2) {
    if (parts[0].length === 4 && parts[1].length === 4) {
      entryDate = new Date(parseInt(parts[0], 10), 0, 1);
    } else if (parts[0].length <= 2 && parts[1].length === 4) {
      entryDate = new Date(parseInt(parts[1], 10), parseInt(parts[0], 10) - 1, 1);
    }
  }

  if (!entryDate || isNaN(entryDate.getTime())) {
    return {
      months: 0,
      days: 0,
      formattedText: entradaStr,
      milestone: null
    };
  }

  const now = new Date();
  const diffTime = now.getTime() - entryDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  const yearsDiff = now.getFullYear() - entryDate.getFullYear();
  const monthsDiff = (yearsDiff * 12) + (now.getMonth() - entryDate.getMonth());
  const effectiveMonths = Math.max(0, monthsDiff);

  let formattedText = '';
  if (effectiveMonths < 1) {
    formattedText = `${diffDays} dia${diffDays === 1 ? '' : 's'}`;
  } else if (effectiveMonths < 12) {
    formattedText = `${effectiveMonths} m${effectiveMonths === 1 ? 'ês' : 'eses'}`;
  } else {
    const y = Math.floor(effectiveMonths / 12);
    const m = effectiveMonths % 12;
    formattedText = m > 0 ? `${y} ano${y > 1 ? 's' : ''} e ${m} m${m === 1 ? 'ês' : 'eses'}` : `${y} ano${y > 1 ? 's' : ''}`;
  }

  let milestone: PatotaMilestone | null = null;

  if (effectiveMonths === 1 || (diffDays >= 25 && diffDays <= 38)) {
    milestone = {
      type: '1_month',
      label: '🎉 1 Mês',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold',
      greetingMessage: `Olá, ${apelidoOrNome}! 🌟 Passando para comemorar seu primeiro mês com a gente na Patota da Casa 6! Como você está se sentindo na nossa comunidade? Conta comigo para o que precisar!`
    };
  } else if (effectiveMonths === 3 || (diffDays >= 80 && diffDays <= 105)) {
    milestone = {
      type: '3_months',
      label: '⭐ 3 Meses',
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300 font-bold',
      greetingMessage: `Olá, ${apelidoOrNome}! 💫 Parabéns pelos seus 3 meses na Patota da Casa 6! Sua presença e energia diária no nosso grupo são muito especiais. Um abraço cósmico com muito carinho!`
    };
  } else if (effectiveMonths === 6 || (diffDays >= 170 && diffDays <= 195)) {
    milestone = {
      type: '6_months',
      label: '🌟 6 Meses',
      badgeClass: 'bg-indigo-100 text-indigo-800 border border-indigo-300 font-bold',
      greetingMessage: `Olá, ${apelidoOrNome}! 🔮 Você completou 6 meses de caminhada com a gente na Patota da Casa 6! Metade de um ciclo solar completo! Sou muito grata pela sua confiança. Vamos juntas rumo aos próximos passos!`
    };
  } else if (effectiveMonths % 12 === 0 && effectiveMonths >= 12) {
    const anos = effectiveMonths / 12;
    milestone = {
      type: '12_months',
      label: `👑 ${anos} Ano${anos > 1 ? 's' : ''}`,
      badgeClass: 'bg-purple-100 text-purple-900 border border-purple-300 font-black shadow-xs',
      greetingMessage: `Olá, ${apelidoOrNome}! 🎂👑 Parabéns por completar ${anos} ano${anos > 1 ? 's' : ''} conosco na Patota da Casa 6! Sua fidelidade e carinho inspiram muito o nosso trabalho. Que o céu continue iluminando cada passo do seu caminho!`
    };
  }

  return {
    months: effectiveMonths,
    days: diffDays,
    formattedText,
    milestone
  };
}

const LOCAL_STORAGE_CRM_KEY = 'casa6_crm_master_contacts_v3';

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

  // Definição das colunas solicitadas pelo usuário:
  // - clienteDesde: Data que entrou na Patota (grupo de WhatsApp)
  // - ultimaEntrega: Último cadastro / entrega
  // - cadastro: Coluna inicial que exibe o último acesso ou serviço prestado para este cliente
  const clienteDesde = contact.clienteDesde || contact.dataCadastro || '2025/2026';
  const ultimaEntrega = contact.ultimaEntrega || contact.ultimoAcesso || '—';
  const cadastro = contact.cadastro || contact.ultimoAcesso || contact.dataCadastro || '14/03/2026';

  let sol = contact.sol || '';
  let lua = contact.lua || '';
  let ascendente = contact.ascendente || '';
  let venus = contact.venus || '';
  let marte = contact.marte || '';
  let quiron = contact.quiron || '';
  let jupiter = contact.jupiter || '';
  let saturno = contact.saturno || '';
  let meioDoCeu = contact.meioDoCeu || '';

  if (parsedDate && (!sol || !ascendente || !venus)) {
    try {
      const astro = calculateAstroProfile(dataNascimento, contact.horarioNascimento || '12:00');
      sol = sol || astro.sol || '';
      lua = lua || astro.lua || '';
      ascendente = ascendente || astro.ascendente || '';
      venus = venus || astro.venus || '';
      marte = marte || astro.marte || '';
      quiron = quiron || astro.quiron || '';
      jupiter = jupiter || astro.jupiter || '';
      saturno = saturno || astro.saturno || '';
      meioDoCeu = meioDoCeu || astro.meioDoCeu || '';
    } catch {
      // fallback gracioso
    }
  }

  return {
    id: contact.id || `crm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    cadastro,
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
    sol,
    lua,
    ascendente,
    venus,
    marte,
    quiron,
    jupiter,
    saturno,
    meioDoCeu,
    patotaStatus: contact.patotaStatus || 'Não Assinante',
    patotaAssinatura: contact.patotaAssinatura || '—',
    patotaValor: contact.patotaValor || '',
    patotaWhatsAppStatus: contact.patotaWhatsAppStatus || (contact.patotaStatus === 'Ativo' ? 'Habilitado' : 'Pendente'),
    clienteDesde,
    ultimaEntrega,
    dataCadastro: clienteDesde,
    ultimoAcesso: ultimaEntrega,
    tags: Array.isArray(contact.tags) ? contact.tags : [],
    totalInvested: Number(contact.totalInvested) || 0,
    notes: contact.notes || '',
    servicesHistory: Array.isArray(contact.servicesHistory) ? contact.servicesHistory : [],
    status: contact.status || 'ativo',
    createdAt: contact.createdAt || new Date().toISOString(),
    updatedAt: contact.updatedAt || new Date().toISOString()
  };
}

/**
 * Retorna a lista completa de contatos do CRM.
 * Garante que todos os 1.100 contatos importados do arquivo da Casa 6 estejam sempre presentes!
 */
export async function getCRMContactsList(): Promise<CRMContactDetail[]> {
  const masterInitialList = (importedContactsData as any[]).map(normalizeContact);

  // 1. Tentar Firestore se estiver conectado
  if (isFirebaseReady && db) {
    try {
      const snapshot = await getDocs(collection(db, 'crm_contatos'));
      if (!snapshot.empty && snapshot.docs.length >= 1000) {
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
        if (Array.isArray(parsed) && parsed.length >= 1000) {
          return parsed.map(normalizeContact);
        }
      }
      // Se não tiver ou for incompleto, salva a lista mestre de 1.100 contatos
      localStorage.setItem(LOCAL_STORAGE_CRM_KEY, JSON.stringify(masterInitialList));
    } catch {
      // Ignora erro de storage
    }
  }

  return masterInitialList;
}

/**
 * Sincroniza em lotes todos os 1.100 contatos para a coleção 'crm_contatos' no Firestore
 */
export async function syncAllContactsToFirestore(
  onProgress?: (current: number, total: number) => void
): Promise<{ success: boolean; totalSynced: number }> {
  const list = await getCRMContactsList();
  if (!isFirebaseReady || !db) {
    return { success: false, totalSynced: list.length };
  }

  try {
    const chunkSize = 400; // Limite seguro do batch do Firestore (máx 500)
    for (let i = 0; i < list.length; i += chunkSize) {
      const chunk = list.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      for (const item of chunk) {
        const ref = doc(db, 'crm_contatos', item.id);
        batch.set(ref, item, { merge: true });
      }
      await batch.commit();
      if (onProgress) {
        onProgress(Math.min(i + chunkSize, list.length), list.length);
      }
    }
    return { success: true, totalSynced: list.length };
  } catch (err) {
    console.error('[CRMService] Erro ao sincronizar coleção Firestore:', err);
    return { success: false, totalSynced: 0 };
  }
}

export async function saveCRMContactDetail(contact: Partial<CRMContactDetail>): Promise<CRMContactDetail> {
  const currentList = await getCRMContactsList();
  const now = new Date().toISOString();
  const id = contact.id || `crm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

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

  const clienteDesde = contact.clienteDesde || contact.dataCadastro || new Date().toLocaleDateString('pt-BR');
  const ultimaEntrega = contact.ultimaEntrega || contact.ultimoAcesso || new Date().toLocaleDateString('pt-BR');
  const cadastro = new Date().toLocaleDateString('pt-BR'); // Atualizado com o último acesso ou serviço prestado

  const mergedContact: CRMContactDetail = {
    id,
    cadastro,
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
    patotaWhatsAppStatus: contact.patotaWhatsAppStatus || (contact.patotaStatus === 'Ativo' ? 'Habilitado' : 'Pendente'),
    clienteDesde,
    ultimaEntrega,
    dataCadastro: clienteDesde,
    ultimoAcesso: ultimaEntrega,
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
