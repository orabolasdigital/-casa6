import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getMPConfig } from '../_lib/mercadopago-helper.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const paymentId = req.query.payment_id || req.query.id;
    const externalReference = req.query.external_reference;

    if (!paymentId && !externalReference) {
      return res.status(400).json({ error: 'Informe payment_id ou external_reference' });
    }

    const config = await getMPConfig();
    const client = new MercadoPagoConfig({ accessToken: config.accessToken });
    const payment = new Payment(client);

    if (paymentId) {
      const paymentInfo = await payment.get({ id: paymentId });
      return res.status(200).json({
        id: paymentInfo.id,
        status: paymentInfo.status,
        status_detail: paymentInfo.status_detail,
        external_reference: paymentInfo.external_reference
      });
    }

    return res.status(200).json({
      status: 'pending'
    });
  } catch (error) {
    console.warn('[Mercado Pago Status Polling Warning]', error.message);
    return res.status(200).json({
      status: 'pending',
      warning: 'Consulta temporariamente indisponível'
    });
  }
}
