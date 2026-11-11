/**
 * Vercel Serverless Function: Criação de Preferência Mercado Pago Checkout Pro
 * Executa em ambiente Node.js de produção para evitar restrições de CORS no browser
 */
export default async function handler(req, res) {
  // Configuração de CORS para permitir requisições do frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const {
      itemTitle,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      customerCpf,
      shippingAddress
    } = req.body || {};

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || 'APP_USR-4792573173504312-032408-d308254532b5ca96722ad2b55ba1d75b-62245601';

    const nameParts = (customerName || 'Cliente').trim().split(' ');
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.slice(1).join(' ') || 'Casa 6';

    const cleanAmount = Number(Number(amount || 53).toFixed(2));

    const origin = req.headers.origin || 'https://casa6.com.br';

    const preferencePayload = {
      items: [
        {
          id: `item_${Date.now()}`,
          title: itemTitle || 'Casa 6 - Bianca Tofoli',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: cleanAmount
        }
      ],
      payer: {
        name: firstName,
        surname: lastName,
        email: (customerEmail || 'cliente@casa6.com.br').trim().toLowerCase(),
        phone: customerPhone ? { number: customerPhone.replace(/\D/g, '') } : undefined,
        identification: customerCpf ? {
          type: 'CPF',
          number: customerCpf.replace(/\D/g, '')
        } : undefined,
        address: shippingAddress ? {
          street_name: shippingAddress.street,
          street_number: Number(shippingAddress.number) || 0,
          zip_code: shippingAddress.cep ? shippingAddress.cep.replace(/\D/g, '') : undefined
        } : undefined
      },
      back_urls: {
        success: `${origin}/membros`,
        failure: `${origin}/loja`,
        pending: `${origin}/membros`
      },
      auto_return: 'approved'
    };

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferencePayload)
    });

    const data = await mpRes.json();

    if (!mpRes.ok) {
      console.error('[Mercado Pago API Error]', data);
      return res.status(mpRes.status).json({
        error: data.message || 'Erro ao comunicar com Mercado Pago',
        details: data
      });
    }

    return res.status(200).json({
      preferenceId: data.id,
      initPoint: data.init_point,
      sandboxInitPoint: data.sandbox_init_point
    });
  } catch (error) {
    console.error('[Server Error in create-preference]', error);
    return res.status(500).json({ error: 'Erro interno ao processar preferência de pagamento' });
  }
}
