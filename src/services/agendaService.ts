/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Agenda & Atendimentos Astrológicos (Google Calendar Sync)
 * Coleção Firestore: 'agenda_atendimentos'
 */

import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';

export interface AppointmentItem {
  id: string;
  contactId?: string;
  clientName: string;
  clientEmail: string;
  clientWhatsapp: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  meetLink: string;
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  gmailAccount: string;
  amount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_AGENDA_KEY = 'casa6_agenda_repository';

export const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt_1',
    contactId: 'crm_clara_oliveira',
    clientName: 'Clara Oliveira',
    clientEmail: 'clara.oliveira@gmail.com',
    clientWhatsapp: '11987654321',
    serviceId: 'mapa-natal',
    serviceName: 'Mapa Natal Individual',
    date: '2026-11-20',
    time: '14:30',
    durationMinutes: 90,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'confirmado',
    gmailAccount: 'bianca@casa6.com.br',
    amount: 350.0,
    notes: 'Preparar retorno do trânsito de Saturno e foco na vocação profissional.',
    createdAt: '2026-11-15T10:00:00.000Z',
    updatedAt: '2026-11-15T10:00:00.000Z'
  },
  {
    id: 'apt_2',
    contactId: 'crm_juliana_santos',
    clientName: 'Juliana Santos',
    clientEmail: 'juliana.santos@outlook.com',
    clientWhatsapp: '21988887777',
    serviceId: 'revolucao-solar',
    serviceName: 'Mapa Revolução Solar 2026/2027',
    date: '2026-11-22',
    time: '10:00',
    durationMinutes: 90,
    meetLink: 'https://meet.google.com/klm-nopq-rst',
    status: 'agendado',
    gmailAccount: 'consultas.casa6@gmail.com',
    amount: 350.0,
    notes: 'Aniversário em 29 de novembro. Foco nos ciclos do novo ano solar.',
    createdAt: '2026-11-12T16:00:00.000Z',
    updatedAt: '2026-11-12T16:00:00.000Z'
  },
  {
    id: 'apt_3',
    contactId: 'crm_marcos_silva',
    clientName: 'Marcos Silva (Grupo Fleury)',
    clientEmail: 'marcos.silva@empresa.com.br',
    clientWhatsapp: '11976543210',
    serviceId: 'palestra-nr1',
    serviceName: 'Alinhamento Pré-Palestra NR-1',
    date: '2026-11-25',
    time: '16:00',
    durationMinutes: 60,
    meetLink: 'https://meet.google.com/uvw-xyz1-234',
    status: 'confirmado',
    gmailAccount: 'bianca@casa6.com.br',
    amount: 0.0,
    notes: 'Reunião de alinhamento com a diretoria de RH e SESMT para a palestra.',
    createdAt: '2026-11-10T11:00:00.000Z',
    updatedAt: '2026-11-10T11:00:00.000Z'
  }
];

export async function getAppointmentsList(): Promise<AppointmentItem[]> {
  if (isFirebaseReady && db) {
    try {
      const snapshot = await getDocs(collection(db, 'agenda_atendimentos'));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data() as AppointmentItem);
      }
      for (const item of INITIAL_APPOINTMENTS) {
        await setDoc(doc(db, 'agenda_atendimentos', item.id), item);
      }
      return INITIAL_APPOINTMENTS;
    } catch (err) {
      console.warn('[AgendaService] Erro Firestore, usando cache local:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_AGENDA_KEY);
      if (cached) return JSON.parse(cached);
      localStorage.setItem(LOCAL_STORAGE_AGENDA_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
    } catch {
      // Ignora erro de storage
    }
  }

  return INITIAL_APPOINTMENTS;
}

export async function saveAppointmentItem(apt: Partial<AppointmentItem>): Promise<AppointmentItem> {
  const currentList = await getAppointmentsList();
  const now = new Date().toISOString();
  const id = apt.id || `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const fullAppointment: AppointmentItem = {
    id,
    contactId: apt.contactId || '',
    clientName: apt.clientName || 'Cliente',
    clientEmail: (apt.clientEmail || '').toLowerCase().trim(),
    clientWhatsapp: (apt.clientWhatsapp || '').replace(/\D/g, ''),
    serviceId: apt.serviceId || 'mapa-natal',
    serviceName: apt.serviceName || 'Consulta Astrológica',
    date: apt.date || now.split('T')[0],
    time: apt.time || '14:00',
    durationMinutes: apt.durationMinutes || 90,
    meetLink: apt.meetLink || 'https://meet.google.com/novo',
    status: apt.status || 'agendado',
    gmailAccount: apt.gmailAccount || 'bianca@casa6.com.br',
    amount: apt.amount || 350.0,
    notes: apt.notes || '',
    createdAt: apt.createdAt || now,
    updatedAt: now
  };

  if (isFirebaseReady && db) {
    try {
      await setDoc(doc(db, 'agenda_atendimentos', id), fullAppointment, { merge: true });
    } catch (err) {
      console.warn('[AgendaService] Erro ao salvar no Firestore:', err);
    }
  }

  const existingIndex = currentList.findIndex((a) => a.id === id);
  let updatedList: AppointmentItem[];
  if (existingIndex >= 0) {
    updatedList = [...currentList];
    updatedList[existingIndex] = fullAppointment;
  } else {
    updatedList = [fullAppointment, ...currentList];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_AGENDA_KEY, JSON.stringify(updatedList));
  }

  return fullAppointment;
}

export function generateGoogleCalendarUrl(apt: AppointmentItem): string {
  const [year, month, day] = apt.date.split('-');
  const [hour, minute] = apt.time.split(':');

  const startDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  const endDate = new Date(startDate.getTime() + apt.durationMinutes * 60000);

  const formatGCal = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const datesParam = `${formatGCal(startDate)}/${formatGCal(endDate)}`;
  const title = encodeURIComponent(`${apt.serviceName} — ${apt.clientName} (Casa 6)`);
  const details = encodeURIComponent(
    `Atendimento Casa 6 com Bianca Tofoli\n\nCliente: ${apt.clientName}\nWhatsApp: ${apt.clientWhatsapp}\nLink do Meet: ${apt.meetLink}\nNotas: ${apt.notes}`
  );
  const location = encodeURIComponent(apt.meetLink);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}

export async function deleteAppointmentItem(id: string): Promise<void> {
  const currentList = await getAppointmentsList();
  const filtered = currentList.filter((a) => a.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_AGENDA_KEY, JSON.stringify(filtered));
  }

  if (isFirebaseReady && db) {
    try {
      await deleteDoc(doc(db, 'agenda_atendimentos', id));
    } catch (err) {
      console.warn('[AgendaService] Erro ao deletar no Firestore:', err);
    }
  }
}

