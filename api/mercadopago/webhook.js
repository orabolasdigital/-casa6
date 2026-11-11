import { MercadoPagoConfig, Payment } from 'mercadopago';
import {
  getMPConfig,
  verifyMercadoPagoSignature
} from '../_lib/mercadopago-helper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];
    const { action, data, type } = req.body || {};

    const dataId = data?.id || req.query?.['data.id'] || req.query?.id;

    const config = await getMPConfig();

    // 1. Verificação de Assinatura HMAC-SHA256 se fornecida pelo Mercado Pago
    if (xSignature && xRequestId && dataId) {
      const isValid = verifyMercadoPagoSignature({
        xSignature,
        xRequestId,
        dataId,
        webhookSecret: config.webhookSecret
      });

      if (!isValid) {
        console.warn('[Mercado Pago Webhook] Assinatura HMAC inválida detectada.');
      }
    }

    // 2. Busca do Pagamento Atualizado na API do Mercado Pago
    if (dataId && (action === 'payment.updated' || action === 'payment.created' || type === 'payment')) {
      const client = new MercadoPagoConfig({ accessToken: config.accessToken });
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: dataId });

      console.log(`[Mercado Pago Webhook] Pagamento #${dataId} - Status: ${paymentInfo.status} (Referência: ${paymentInfo.external_reference})`);

      // Se status === 'approved', o webhook confirma a liquidação
      if (paymentInfo.status === 'approved') {
        // Notificação de liquidação concluída
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Mercado Pago Webhook Error]', error);
    // Retorna 200 para evitar retentativas agressivas de webhook do MP
    return res.status(200).json({ received: true, error: error.message });
  }
}
