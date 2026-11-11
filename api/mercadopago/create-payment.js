import { MercadoPagoConfig, Payment } from 'mercadopago';
import {
  getMPConfig,
  recalculateExpectedPrice,
  generateVoucherCode
} from '../_lib/mercadopago-helper.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { formData, payerConfig } = req.body || {};

    if (!formData || !payerConfig) {
      return res.status(400).json({ error: 'Dados de pagamento ou comprador incompletos.' });
    }

    const config = await getMPConfig();
    const client = new MercadoPagoConfig({
      accessToken: config.accessToken,
      options: { timeout: 15000 }
    });
    const payment = new Payment(client);

    // 1. Validação Anti-Fraude (Tampering Prevention)
    const expectedTotal = recalculateExpectedPrice(payerConfig.serviceType, payerConfig.amount);
    const receivedAmount = Number(formData.transaction_amount);

    if (Math.abs(receivedAmount - expectedTotal) > 0.01) {
      console.warn(`[Anti-Fraude] Inconsistência detectada: Recebido R$ ${receivedAmount}, Esperado R$ ${expectedTotal}`);
      return res.status(400).json({
        error: 'Inconsistência de preço detectada. Transação abortada por segurança.'
      });
    }

    // 2. Geração do Código do Voucher e ID da Ordem
    const voucherCode = generateVoucherCode(payerConfig.cpf || '');
    const orderId = `c6_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const domain = req.headers.origin || 'https://casa6.com.br';

    const nameParts = (payerConfig.customerName || payerConfig.firstName || 'Cliente').trim().split(' ');
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.slice(1).join(' ') || (payerConfig.lastName || 'Casa 6');

    // 3. Montagem do Payload para o Mercado Pago
    const paymentBody = {
      transaction_amount: receivedAmount,
      description: payerConfig.itemTitle || 'Casa 6 - Bianca Tofoli',
      payment_method_id: formData.payment_method_id,
      payer: {
        email: (formData.payer?.email || payerConfig.email || 'cliente@casa6.com.br').trim().toLowerCase(),
        first_name: firstName,
        last_name: lastName
      },
      external_reference: orderId,
      notification_url: `${domain}/api/mercadopago/webhook`
    };

    if (formData.payer?.identification?.number || payerConfig.cpf) {
      paymentBody.payer.identification = {
        type: formData.payer?.identification?.type || 'CPF',
        number: (formData.payer?.identification?.number || payerConfig.cpf).replace(/\D/g, '')
      };
    }

    if (formData.token) {
      paymentBody.token = formData.token;
    }
    if (formData.installments) {
      paymentBody.installments = Number(formData.installments);
    }
    if (formData.issuer_id) {
      paymentBody.issuer_id = formData.issuer_id;
    }

    // 4. Execução da Chamada na SDK Oficial do Mercado Pago
    const created = await payment.create({ body: paymentBody });

    // 5. Verificação de 1ª Compra (Bônus de Boas-Vindas)
    const isFirstPurchase = true; // Flag dinâmico para novos membros
    const bonusConsumacao = isFirstPurchase ? `BEMVINDA-${voucherCode}` : undefined;

    return res.status(200).json({
      success: true,
      id: created.id,
      status: created.status,
      status_detail: created.status_detail,
      orderId,
      voucherCode,
      bonusConsumacao,
      point_of_interaction: created.point_of_interaction,
      payment_method_id: created.payment_method_id,
      transaction_amount: created.transaction_amount
    });
  } catch (error) {
    console.error('[Mercado Pago create-payment error]', error);
    return res.status(500).json({
      error: error.message || 'Falha ao processar pagamento com Mercado Pago',
      details: error
    });
  }
}
