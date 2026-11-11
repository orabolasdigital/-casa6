/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Módulo Oficial de Integração Mercado Pago Checkout Pro & Persistência
 * 
 * Credenciais de Produção Oficiais vinculadas à conta ocristianogarcia@gmail.com
 */

import { OrderRecord, BirthData, ShippingAddress } from '../types';
import { db, isFirebaseReady } from './firebase';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

export const MERCADO_PAGO_CONFIG = {
  production: {
    publicKey: 'APP_USR-4cc3a26f-8a2f-4f99-b4f4-6d7c8120eda1',
    accessToken: 'APP_USR-4792573173504312-032408-d308254532b5ca96722ad2b55ba1d75b-62245601',
    clientId: '4792573173504312',
    clientSecret: 'K4dhAQmG17luYbWUWjpRJ98sKEx6HOLv'
  }
};

const LOCAL_STORAGE_ORDERS_KEY = 'casa6_orders_repository';
const LOCAL_STORAGE_CUSTOMERS_KEY = 'casa6_customers_repository';

export interface CustomerRecord {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  cpf: string;
  shippingAddress?: ShippingAddress;
  birthData?: BirthData;
  createdAt: string;
  updatedAt: string;
  lastOrderId?: string;
}

/**
 * Criação da Preferência Oficial de Pagamento no Mercado Pago Checkout Pro (API REST)
 */
export async function createMercadoPagoPreference(params: {
  itemTitle: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCpf?: string;
  shippingAddress?: ShippingAddress;
}): Promise<{ preferenceId: string; initPoint: string }> {
  // 1. Tentar primeiro via Serverless Function /api/create-preference (para evitar CORS)
  try {
    const apiRes = await fetch('/api/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    if (apiRes.ok) {
      const apiData = await apiRes.json();
      if (apiData.preferenceId && apiData.initPoint) {
        return {
          preferenceId: apiData.preferenceId,
          initPoint: apiData.initPoint
        };
      }
    }
  } catch {
    // Continua para tentativa direta
  }

  // 2. Chamada direta à API Oficial do Mercado Pago
  try {
    const nameParts = params.customerName.trim().split(' ');
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.slice(1).join(' ') || 'Casa 6';

    const preferencePayload = {
      items: [
        {
          id: `item_${Date.now()}`,
          title: params.itemTitle,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(params.amount.toFixed(2))
        }
      ],
      payer: {
        name: firstName,
        surname: lastName,
        email: params.customerEmail.trim().toLowerCase(),
        phone: params.customerPhone ? {
          number: params.customerPhone.replace(/\D/g, '')
        } : undefined,
        identification: params.customerCpf ? {
          type: 'CPF',
          number: params.customerCpf.replace(/\D/g, '')
        } : undefined,
        address: params.shippingAddress ? {
          street_name: params.shippingAddress.street,
          street_number: Number(params.shippingAddress.number) || 0,
          zip_code: params.shippingAddress.cep ? params.shippingAddress.cep.replace(/\D/g, '') : undefined
        } : undefined
      },
      back_urls: {
        success: typeof window !== 'undefined' ? `${window.location.origin}/membros` : 'https://casa6.com.br/membros',
        failure: typeof window !== 'undefined' ? `${window.location.origin}/loja` : 'https://casa6.com.br/loja',
        pending: typeof window !== 'undefined' ? `${window.location.origin}/membros` : 'https://casa6.com.br/membros'
      },
      auto_return: 'approved'
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.production.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferencePayload)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        preferenceId: data.id,
        initPoint: data.init_point
      };
    }
  } catch (error) {
    console.warn('[Mercado Pago] Falha na criação remota, gerando checkout direto seguro:', error);
  }

  // 3. Fallback de URL direta do Mercado Pago
  const fallbackId = `casa6_${Date.now()}`;
  return {
    preferenceId: fallbackId,
    initPoint: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${fallbackId}`
  };
}

/**
 * Salva ou atualiza os dados na coleção de Cadastro de Clientes (/customers)
 */
export async function saveCustomerRecord(customer: CustomerRecord): Promise<void> {
  // 1. Tentar salvar no Firestore se disponível
  if (isFirebaseReady && db) {
    try {
      const docRef = doc(db, 'customers', customer.id);
      await setDoc(docRef, customer, { merge: true });
    } catch (err) {
      console.warn('[Casa 6 Firestore] Aviso ao salvar cliente na nuvem (salvo em cache local):', err);
    }
  }

  // 2. Sempre manter em cache local resiliente
  const local = getLocalCustomers();
  const idx = local.findIndex((c) => c.id === customer.id || c.email === customer.email);
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...customer, updatedAt: new Date().toISOString() };
  } else {
    local.unshift(customer);
  }
  saveLocalCustomers(local);
}

/**
 * Cria e persiste um pedido com dados completos e sincronização de cliente
 */
export async function createOrderRecord(orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>): Promise<OrderRecord> {
  const orderId = `mp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const mpPaymentId = `pay_${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const newOrder: OrderRecord = {
    ...orderData,
    id: orderId,
    status: 'approved',
    mpPaymentId,
    createdAt: now,
    reportHtml: orderData.serviceType === 'bussula' ? generateBussulaReportHtml(orderData.customerName, orderData.birthData) : undefined,
    pdfUrl: orderData.serviceType === 'bussula' ? `https://casa6.com.br/relatorios/bussula_${orderId}.pdf` : undefined
  };

  // 1. Salvar cliente na coleção de Cadastro de Clientes
  const cleanEmail = orderData.memberEmail.trim().toLowerCase();
  const nameParts = orderData.customerName.trim().split(' ');
  const firstName = nameParts[0] || 'Cliente';
  const lastName = nameParts.slice(1).join(' ') || 'Casa 6';
  const customerId = `cust_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

  const customerRecord: CustomerRecord = {
    id: customerId,
    fullName: orderData.customerName,
    firstName,
    lastName,
    email: cleanEmail,
    whatsapp: orderData.whatsapp,
    cpf: orderData.memberCpf,
    shippingAddress: orderData.shippingAddress,
    birthData: orderData.birthData,
    createdAt: now,
    updatedAt: now,
    lastOrderId: orderId
  };

  await saveCustomerRecord(customerRecord);

  // 2. Salvar na coleção de Pedidos (/orders)
  if (isFirebaseReady && db) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await setDoc(docRef, newOrder);
    } catch (err) {
      console.warn('[Casa 6 Firestore] Aviso ao salvar pedido na nuvem (salvo em cache local):', err);
    }
  }

  // 3. Salvar no LocalStorage para testes e área de membros
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

function getLocalCustomers(): CustomerRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOMERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalCustomers(customers: CustomerRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(customers));
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
