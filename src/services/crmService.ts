/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de CRM & Repositório Central de Cadastros (Coração do Sistema)
 * Coleção Firestore: 'crm_contatos'
 */

import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';

export interface CRMContactDetail {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  whatsapp: string;
  cpf?: string;
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
  birthHour?: string;
  birthMinute?: string;
  city?: string;
  state?: string;
  tags: string[];
  totalInvested: number;
  notes: string;
  servicesHistory: {
    id: string;
    serviceName: string;
    date: string;
    amount: number;
    status: 'concluido' | 'em_andamento' | 'agendado';
  }[];
  status: 'ativo' | 'em_atendimento' | 'concluido' | 'inativo';
  lastSource?: string;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_CRM_KEY = 'casa6_crm_master_repository';

export const INITIAL_CRM_CONTACTS: CRMContactDetail[] = [
  {
    id: 'crm_clara_oliveira',
    firstName: 'Clara',
    lastName: 'Oliveira',
    fullName: 'Clara Oliveira',
    email: 'clara.oliveira@gmail.com',
    whatsapp: '11987654321',
    cpf: '123.456.789-00',
    birthDay: '14',
    birthMonth: '05',
    birthYear: '1992',
    birthHour: '08',
    birthMinute: '22',
    city: 'São Paulo',
    state: 'SP',
    tags: ['Bússola Pessoal', 'Patota VIP', 'Mapa Natal'],
    totalInvested: 641.0,
    notes: 'Consulente assídua. Trânsito de Saturno na Casa 10 em destaque. Acompanhar quinzena favorável da carreira.',
    servicesHistory: [
      { id: 'srv_1', serviceName: 'Bússola Pessoal', date: '2026-11-15', amount: 47.0, status: 'concluido' },
      { id: 'srv_2', serviceName: 'Patota Astral — Anual', date: '2026-10-01', amount: 564.0, status: 'concluido' },
      { id: 'srv_3', serviceName: 'Mapa Natal Individual', date: '2026-08-20', amount: 350.0, status: 'concluido' }
    ],
    status: 'ativo',
    lastSource: 'Bússolas Astrológicas',
    createdAt: '2026-11-15T14:30:00.000Z',
    updatedAt: '2026-11-15T14:30:00.000Z'
  },
  {
    id: 'crm_marcos_silva',
    firstName: 'Marcos',
    lastName: 'Silva',
    fullName: 'Marcos Silva',
    email: 'marcos.silva@empresa.com.br',
    whatsapp: '11976543210',
    cpf: '234.567.890-11',
    city: 'Campinas',
    state: 'SP',
    tags: ['Corporativo', 'Palestra NR-1', 'RH'],
    totalInvested: 4500.0,
    notes: 'Diretor de RH do Grupo Fleury. Contratou palestra de saúde mental e inteligência emocional.',
    servicesHistory: [
      { id: 'srv_4', serviceName: 'Palestra Corporativa NR-1', date: '2026-11-10', amount: 4500.0, status: 'concluido' }
    ],
    status: 'concluido',
    lastSource: 'Palestras Corporativas',
    createdAt: '2026-11-10T10:15:00.000Z',
    updatedAt: '2026-11-10T10:15:00.000Z'
  },
  {
    id: 'crm_juliana_santos',
    firstName: 'Juliana',
    lastName: 'Santos',
    fullName: 'Juliana Santos',
    email: 'juliana.santos@outlook.com',
    whatsapp: '21988887777',
    cpf: '345.678.901-22',
    birthDay: '29',
    birthMonth: '11',
    birthYear: '1988',
    birthHour: '17',
    birthMinute: '45',
    city: 'Rio de Janeiro',
    state: 'RJ',
    tags: ['Revolução Solar', 'Bússola Amorosa'],
    totalInvested: 397.0,
    notes: 'Pediu análise especial para aniversário em novembro. Enviar PDF da Bússola Amorosa.',
    servicesHistory: [
      { id: 'srv_5', serviceName: 'Bússola Amorosa', date: '2026-11-12', amount: 47.0, status: 'em_andamento' },
      { id: 'srv_6', serviceName: 'Mapa Revolução Solar', date: '2026-11-05', amount: 350.0, status: 'concluido' }
    ],
    status: 'em_atendimento',
    lastSource: 'Atendimentos',
    createdAt: '2026-11-05T09:00:00.000Z',
    updatedAt: '2026-11-12T16:00:00.000Z'
  },
  {
    id: 'crm_fernanda_lima',
    firstName: 'Fernanda',
    lastName: 'Lima',
    fullName: 'Fernanda Lima',
    email: 'fernanda.lima@gmail.com',
    whatsapp: '31999881122',
    city: 'Belo Horizonte',
    state: 'MG',
    tags: ['Lojinha', 'Box Semeadura', 'Patota VIP'],
    totalInvested: 194.0,
    notes: 'Adquiriu a Box Semeadura e entrou na lista de espera para os próximos lançamentos.',
    servicesHistory: [
      { id: 'srv_7', serviceName: 'Box Semeadura', date: '2026-10-25', amount: 147.0, status: 'concluido' },
      { id: 'srv_8', serviceName: 'Patota Astral — Mensal', date: '2026-11-01', amount: 47.0, status: 'concluido' }
    ],
    status: 'ativo',
    lastSource: 'Lojinha Casa 6',
    createdAt: '2026-10-25T18:20:00.000Z',
    updatedAt: '2026-11-01T11:00:00.000Z'
  }
];

export async function getCRMContactsList(): Promise<CRMContactDetail[]> {
  if (isFirebaseReady && db) {
    try {
      const snapshot = await getDocs(collection(db, 'crm_contatos'));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data() as CRMContactDetail);
      }
      for (const item of INITIAL_CRM_CONTACTS) {
        await setDoc(doc(db, 'crm_contatos', item.id), item);
      }
      return INITIAL_CRM_CONTACTS;
    } catch (err) {
      console.warn('[CRMService] Erro Firestore, usando cache local:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_CRM_KEY);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(LOCAL_STORAGE_CRM_KEY, JSON.stringify(INITIAL_CRM_CONTACTS));
    } catch {
      // Ignora erro de storage
    }
  }

  return INITIAL_CRM_CONTACTS;
}

export async function saveCRMContactDetail(contact: Partial<CRMContactDetail>): Promise<CRMContactDetail> {
  const currentList = await getCRMContactsList();
  const now = new Date().toISOString();
  const id = contact.id || `crm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const fullContact: CRMContactDetail = {
    id,
    firstName: contact.firstName || contact.fullName?.split(' ')[0] || 'Cliente',
    lastName: contact.lastName || contact.fullName?.split(' ').slice(1).join(' ') || '',
    fullName: contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
    email: (contact.email || '').toLowerCase().trim(),
    whatsapp: (contact.whatsapp || '').replace(/\D/g, ''),
    cpf: contact.cpf || '',
    birthDay: contact.birthDay || '',
    birthMonth: contact.birthMonth || '',
    birthYear: contact.birthYear || '',
    birthHour: contact.birthHour || '',
    birthMinute: contact.birthMinute || '',
    city: contact.city || '',
    state: contact.state || '',
    tags: contact.tags || ['Novo Cadastro'],
    totalInvested: contact.totalInvested || 0,
    notes: contact.notes || '',
    servicesHistory: contact.servicesHistory || [],
    status: contact.status || 'ativo',
    lastSource: contact.lastSource || 'Painel de Controle',
    createdAt: contact.createdAt || now,
    updatedAt: now
  };

  if (isFirebaseReady && db) {
    try {
      await setDoc(doc(db, 'crm_contatos', id), fullContact, { merge: true });
    } catch (err) {
      console.warn('[CRMService] Erro ao salvar no Firestore:', err);
    }
  }

  const existingIndex = currentList.findIndex((c) => c.id === id);
  let updatedList: CRMContactDetail[];
  if (existingIndex >= 0) {
    updatedList = [...currentList];
    updatedList[existingIndex] = fullContact;
  } else {
    updatedList = [fullContact, ...currentList];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CRM_KEY, JSON.stringify(updatedList));
  }

  return fullContact;
}

export async function deleteCRMContactDetail(id: string): Promise<void> {
  const currentList = await getCRMContactsList();
  const filtered = currentList.filter((c) => c.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CRM_KEY, JSON.stringify(filtered));
  }

  if (isFirebaseReady && db) {
    try {
      await deleteDoc(doc(db, 'crm_contatos', id));
    } catch (err) {
      console.warn('[CRMService] Erro ao deletar no Firestore:', err);
    }
  }
}

