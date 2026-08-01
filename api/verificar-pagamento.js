/**
 * Vercel Serverless Function — Verificar Pagamento Asaas
 *
 * Endpoints:
 *   GET /api/verificar-pagamento?id=pay_XXX   → consulta cobrança específica
 *   GET /api/verificar-pagamento?link=XXX      → consulta link de pagamento (legado)
 *
 * O token fica em variável de ambiente (NUNCA no frontend).
 *
 * Variável de ambiente necessária:
 *   ASAAS_TOKEN — token de acesso da API Asaas
 */

var ASAAS_API_BASE = 'https://api.asaas.com/v3';

// Status que significam "pagamento efetivamente recebido"
var STATUS_PAGO = ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'];

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Método não permitido. Use GET.' }));
  }

  try {
    var url = new URL(req.url, 'http://localhost');
    var paymentId = url.searchParams.get('id');
    var paymentLinkId = url.searchParams.get('link');

    var token = process.env.ASAAS_TOKEN;
    if (!token) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ pago: false, erro: 'Configuração do servidor ausente.' }));
    }

    // --- Modo 1: Cobrança individual (recomendado) ---
    if (paymentId) {
      if (!/^[a-zA-Z0-9_]+$/.test(paymentId)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ erro: 'Parâmetro "id" inválido.' }));
      }

      var apiUrl = ASAAS_API_BASE + '/payments/' + encodeURIComponent(paymentId);
      console.log('[verificar-pagamento] Consultando cobrança: ' + paymentId);

      var apiRes = await fetch(apiUrl, {
        headers: { 'access_token': token, 'Content-Type': 'application/json' },
      });

      if (!apiRes.ok) {
        console.error('[verificar-pagamento] Asaas HTTP ' + apiRes.status);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ pago: false, erro: 'Erro ao consultar cobrança.' }));
      }

      var payment = await apiRes.json();
      var pago = STATUS_PAGO.indexOf(payment.status) >= 0;

      console.log('[verificar-pagamento] Cobrança ' + paymentId + ': ' + payment.status + (pago ? ' (PAGO)' : ''));

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        pago: pago,
        status: payment.status,
        valor: payment.value,
        forma: payment.billingType,
        data: payment.paymentDate || payment.confirmedDate || payment.dateCreated,
      }));
    }

    // --- Modo 2: Link de pagamento (legado) ---
    if (paymentLinkId) {
      if (!/^[a-zA-Z0-9_-]+$/.test(paymentLinkId)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ erro: 'Parâmetro "link" inválido.' }));
      }

      var sinceTs = parseInt(url.searchParams.get('since') || '0', 10);
      var linkApiUrl = ASAAS_API_BASE + '/payments?paymentLink=' + encodeURIComponent(paymentLinkId) + '&limit=20';
      console.log('[verificar-pagamento] Consultando link: ' + paymentLinkId);

      var linkRes = await fetch(linkApiUrl, {
        headers: { 'access_token': token, 'Content-Type': 'application/json' },
      });

      if (!linkRes.ok) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ pago: false, erro: 'Erro ao consultar link.' }));
      }

      var linkJson = await linkRes.json();
      var todos = linkJson.data || [];
      var pagamentos = todos.filter(function (p) {
        if (STATUS_PAGO.indexOf(p.status) < 0) return false;
        if (sinceTs > 0 && p.dateCreated) {
          if (new Date(p.dateCreated).getTime() <= sinceTs) return false;
        }
        return true;
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        pago: pagamentos.length > 0,
        total: pagamentos.length,
        status: pagamentos.length > 0 ? pagamentos[0].status : null,
      }));
    }

    // Nenhum parâmetro
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Informe "id" ou "link".' }));
  } catch (err) {
    console.error('[verificar-pagamento] Erro interno:', err.message);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ pago: false, erro: 'Erro interno ao verificar.' }));
  }
};
