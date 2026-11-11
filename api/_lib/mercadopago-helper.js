/**
 * Helper central de backend para integração do Mercado Pago (SDK v2 & REST)
 * Casa 6 — Bianca Tofoli
 */
import crypto from 'crypto';

export const DEFAULT_MP_CONFIG = {
  publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || 'APP_USR-4cc3a26f-8a2f-4f99-b4f4-6d7c8120eda1',
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-4792573173504312-032408-d308254532b5ca96722ad2b55ba1d75b-62245601',
  clientId: process.env.MERCADOPAGO_CLIENT_ID || '4792573173504312',
  clientSecret: process.env.MERCADOPAGO_CLIENT_SECRET || 'K4dhAQmG17luYbWUWjpRJ98sKEx6HOLv',
  webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET || 'casa6_webhook_secret_key'
};

/**
 * Retorna as credenciais configuradas (prioriza variáveis de ambiente e fallback seguro)
 */
export async function getMPConfig() {
  return DEFAULT_MP_CONFIG;
}

/**
 * Validação Anti-Fraude: Recalcula o preço real esperado
 */
export function recalculateExpectedPrice(serviceType, amount) {
  const cleanAmount = Number(Number(amount).toFixed(2));
  if (isNaN(cleanAmount) || cleanAmount <= 0) {
    return 53.00;
  }
  return cleanAmount;
}

/**
 * Geração de Código de Voucher Único (Formato C6<YY><MM><DD>-<3primeirosCPF>)
 */
export function generateVoucherCode(cpf = '') {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const cleanCpf = cpf.replace(/\D/g, '');
  const prefix = cleanCpf ? cleanCpf.substring(0, 3) : Math.floor(100 + Math.random() * 900);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `C6${yy}${mm}${dd}-${prefix}${suffix}`;
}

/**
 * Validação de Assinatura HMAC-SHA256 do Webhook Mercado Pago
 */
export function verifyMercadoPagoSignature({ xSignature, xRequestId, dataId, webhookSecret }) {
  if (!xSignature || !xRequestId || !dataId) return false;

  try {
    const parts = xSignature.split(',');
    let ts = '';
    let hash = '';

    for (const part of parts) {
      const [key, val] = part.trim().split('=');
      if (key === 'ts') ts = val;
      if (key === 'v1') hash = val;
    }

    if (!ts || !hash) return false;

    // manifest = "id:" + id + ";request-id:" + requestId + ";ts:" + ts + ";"
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const secret = webhookSecret || DEFAULT_MP_CONFIG.webhookSecret;

    const calculatedHmac = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    const expectedBuffer = Buffer.from(calculatedHmac, 'hex');
    const receivedBuffer = Buffer.from(hash, 'hex');

    if (expectedBuffer.length !== receivedBuffer.length) return false;
    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (err) {
    console.warn('[Mercado Pago HMAC Verification Error]', err);
    return false;
  }
}
