/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo de Integração Mercado Pago & Persistência de Pedidos / Assinaturas
 */

import { OrderRecord, BirthData } from '../types';
import { db, isFirebaseReady, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

export const MERCADO_PAGO_CONFIG = {
  // Credenciais Oficiais
  production: {
    publicKey: 'APP_USR-4cc3a26f-8a2f-4f99-b4f4-6d7c8120eda1',
    accessToken: 'APP_USR-4792573173504312-032408-d308254532b5ca96722ad2b55ba1d75b-62245601',
    clientId: '4792573173504312'
  },
  test: {
    publicKey: 'TEST-a9d96df2-6c62-461c-9bc9-c70c8fadfcbc',
    accessToken: 'TEST-4792573173504312-032408-9d74831dc88ab3a6fe8debfbfa22c6a8-62245601'
  },
  activeMode: 'production' as 'production' | 'test'
};

const LOCAL_STORAGE_ORDERS_KEY = 'casa6_orders_repository';

/**
 * Cria e persiste um pedido com dados de nascimento (Bússola Guia, Patota Astral ou Lojinha)
 */
export async function createOrderRecord(orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>): Promise<OrderRecord> {
  const orderId = `mp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  // Simulação de QR Code Pix e ID de transação Mercado Pago
  const mpPaymentId = `pay_${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const newOrder: OrderRecord = {
    ...orderData,
    id: orderId,
    status: 'approved', // Simulação instantânea de aprovação para demonstração de checkout
    mpPaymentId,
    createdAt: now,
    reportHtml: orderData.serviceType === 'bussula' ? generateBussulaReportHtml(orderData.customerName, orderData.birthData) : undefined,
    pdfUrl: orderData.serviceType === 'bussula' ? `https://casa6.com.br/relatorios/bussula_${orderId}.pdf` : undefined
  };

  // 1. Salvar no Firestore se disponível
  if (isFirebaseReady && db) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await setDoc(docRef, newOrder);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
    }
  }

  // 2. Salvar no LocalStorage para testes e área de membros
  const existing = getLocalOrders();
  existing.unshift(newOrder);
  saveLocalOrders(existing);

  return newOrder;
}

/**
 * Busca pedidos por E-mail e CPF para a Área de Membros
 */
export async function getOrdersByMember(email: string, cpf: string): Promise<OrderRecord[]> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCpf = cpf.replace(/\D/g, '');

  if (isFirebaseReady && db) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('memberEmail', '==', cleanEmail)
      );
      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map((d) => d.data() as OrderRecord);
      if (orders.length > 0) {
        return orders;
      }
    } catch {
      // continua para fallback local
    }
  }

  // Fallback LocalStorage
  const local = getLocalOrders();
  return local.filter((ord) => {
    const ordEmail = (ord.memberEmail || '').trim().toLowerCase();
    const ordCpf = (ord.memberCpf || '').replace(/\D/g, '');
    return ordEmail === cleanEmail || (cleanCpf && ordCpf === cleanCpf);
  });
}

function getLocalOrders(): OrderRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: OrderRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Silently continue
  }
}

/**
 * Gera relatório astrológico mensal em HTML da Bússola Guia
 */
export function generateBussulaReportHtml(customerName: string, birthData?: BirthData | Record<string, string>): string {
  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date());
  const bData = birthData as Record<string, string> | undefined;
  const birthInfo = bData
    ? `${bData.birthDay || '15'}/${bData.birthMonth || '05'}/${bData.birthYear || '1992'} às ${bData.birthHour || '14'}:${bData.birthMinute || '30'} em ${bData.city || 'São Paulo'}/${bData.state || 'SP'}`
    : 'Mapa Base Padrão';

  return `
    <div style="font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif; color: #2B2566; max-width: 800px; margin: 0 auto; padding: 32px; background: #FCFAF7; border-radius: 16px; border: 1px solid #E2DCCF;">
      <div style="text-align: center; border-bottom: 2px solid #F0B55E; padding-bottom: 24px; margin-bottom: 28px;">
        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.25em; color: #8C987F;">Casa 6 — Bianca Tofoli</span>
        <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; margin: 8px 0; color: #2B2566; font-weight: 700;">Bússola Guia — Relatório Astral Personalizado</h1>
        <p style="font-size: 14px; color: #423C7B; margin: 0;">Ciclo de <strong>${monthName.toUpperCase()}</strong></p>
      </div>

      <div style="background: #F4EFE6; padding: 18px 24px; border-radius: 12px; margin-bottom: 28px; border: 1px solid #E2DCCF;">
        <p style="margin: 0; font-size: 13px; font-weight: bold; color: #2B2566;">CONSULENTE: ${customerName.toUpperCase()}</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #423C7B;">DADOS DE NASCIMENTO: ${birthInfo}</p>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #2B2566; border-left: 4px solid #F0B55E; padding-left: 12px; margin-bottom: 12px; font-weight: 700;">1. Clima Cósmico do Mês & Seus Trânsitos</h2>
        <p style="font-size: 14px; line-height: 1.7; color: #423C7B;">
          Este ciclo traz um convite expressivo para alinhar suas iniciativas práticas aos seus verdadeiros ritmos biológicos. Com o trânsito do Sol ativando áreas de expressão e foco, sua clareza mental estará potencializada na primeira quinzena. Evite decisões precipitadas em torno da fase de Lua Cheia, momento ideal para colher entendimentos e dissolver expectativas ilusórias.
        </p>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #2B2566; border-left: 4px solid #F0B55E; padding-left: 12px; margin-bottom: 12px; font-weight: 700;">2. Datas Chave e Janelas de Oportunidade</h2>
        <ul style="font-size: 14px; line-height: 1.8; color: #423C7B; padding-left: 20px;">
          <li><strong>05 a 09:</strong> Fase favorável para lançamentos, acordos e reorganização de rotina de trabalho.</li>
          <li><strong>14 a 17:</strong> Lua Cheia em ápice emocional — priorize o descanso e a integração interna.</li>
          <li><strong>22 a 26:</strong> Janela excelente para conversas difíceis, acordos de limites e planejamento financeiro.</li>
        </ul>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #2B2566; border-left: 4px solid #F0B55E; padding-left: 12px; margin-bottom: 12px; font-weight: 700;">3. Prática Consciente Recomendada</h2>
        <p style="font-size: 14px; line-height: 1.7; color: #423C7B;">
          Dedique 10 minutos diários pela manhã à pausa respiratória antes de checar aparelhos eletrônicos. A astrologia da Casa 6 lembra: autoconhecimento só tem valor quando se traduz em presença lúcida e respeito aos seus ciclos vitais.
        </p>
      </div>

      <div style="text-align: center; border-top: 1px solid #E2DCCF; padding-top: 24px; font-size: 11px; color: #8C987F;">
        <p>© Casa 6 — Bianca Tofoli. Conteúdo exclusivo para uso pessoal. Documento registrado.</p>
      </div>
    </div>
  `;
}
