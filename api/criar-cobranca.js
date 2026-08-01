/**
 * Vercel Serverless Function — Criar Cobrança PIX no Asaas
 *
 * Endpoint: POST /api/criar-cobranca
 * Body: { "nome": "Nome do Cliente" }
 *
 * Cria um cliente e uma cobrança PIX individual no Asaas.
 * Cada cliente recebe seu próprio PIX — sem link compartilhado.
 *
 * Variável de ambiente necessária:
 *   ASAAS_TOKEN — token de acesso da API Asaas
 */

const ASAAS_API_BASE = 'https://api.asaas.com/v3';

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Use POST.' }));
  }

  try {
    // Lê o body
    var body = '';
    req.on('data', function (chunk) { body += chunk; });
    await new Promise(function (resolve) { req.on('end', resolve); });

    var parsed;
    try { parsed = JSON.parse(body); } catch (e) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Body inválido. Envie JSON com { "nome": "..." }.' }));
    }

    var nome = (parsed.nome || '').trim();
    if (!nome || nome.length < 2) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Nome do cliente é obrigatório (mín. 2 caracteres).' }));
    }

    var token = process.env.ASAAS_TOKEN;
    if (!token) {
      console.error('[criar-cobranca] ASAAS_TOKEN não configurado.');
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Configuração do servidor ausente.' }));
    }

    // 1. Cria o cliente no Asaas
    console.log('[criar-cobranca] Criando cliente: ' + nome);
    var customerRes = await fetch(ASAAS_API_BASE + '/customers', {
      method: 'POST',
      headers: {
        'access_token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nome,
        notificationDisabled: true,
      }),
    });

    if (!customerRes.ok) {
      var errText = await customerRes.text();
      console.error('[criar-cobranca] Erro ao criar cliente: ' + errText);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Erro ao criar cliente no Asaas.' }));
    }

    var customer = await customerRes.json();
    console.log('[criar-cobranca] Cliente criado: ' + customer.id);

    // 2. Cria a cobrança PIX
    // Data de vencimento: hoje + 1 dia
    var amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    var dueDate = amanha.getFullYear() + '-' +
      String(amanha.getMonth() + 1).padStart(2, '0') + '-' +
      String(amanha.getDate()).padStart(2, '0');

    console.log('[criar-cobranca] Criando cobrança PIX para ' + customer.id);

    var paymentRes = await fetch(ASAAS_API_BASE + '/payments', {
      method: 'POST',
      headers: {
        'access_token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: 'PIX',
        value: 300,
        dueDate: dueDate,
        description: 'Desenvolvimento de site - ' + nome,
        postalService: false,
      }),
    });

    if (!paymentRes.ok) {
      var payErrText = await paymentRes.text();
      console.error('[criar-cobranca] Erro ao criar cobrança: ' + payErrText);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Erro ao criar cobrança no Asaas.' }));
    }

    var payment = await paymentRes.json();
    console.log('[criar-cobranca] Cobrança criada: ' + payment.id + ' | Status: ' + payment.status);

    // 3. Retorna os dados para o frontend
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      paymentId: payment.id,
      status: payment.status,
      valor: payment.value,
      pixQrCodeUrl: payment.pixQrCodeUrl || null,
      pixCopiaECola: payment.pixCopiaECola || null,
      invoiceUrl: payment.invoiceUrl || null,
      cliente: customer.id,
    }));
  } catch (err) {
    console.error('[criar-cobranca] Erro interno:', err.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno ao criar cobrança.' }));
  }
};
