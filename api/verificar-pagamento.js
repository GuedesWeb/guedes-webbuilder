/**
 * Vercel Serverless Function — Verificar Pagamento Asaas
 *
 * Endpoint: GET /api/verificar-pagamento?link=PAYMENT_LINK_ID
 *
 * Intermediário seguro entre o frontend e a API do Asaas.
 * A API do Asaas bloqueia CORS do navegador → esta function resolve.
 * O token fica em variável de ambiente (NUNCA no frontend).
 *
 * Variável de ambiente necessária:
 *   ASAAS_TOKEN — token de acesso da API Asaas
 */

const ASAAS_API_BASE = 'https://api.asaas.com/v3';

module.exports = async function handler(req, res) {
  // CORS — permite chamadas do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // Apenas GET
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Método não permitido. Use GET.' }));
  }

  try {
    // Extrai os parâmetros da query string
    const url = new URL(req.url, 'http://localhost');
    const paymentLinkId = url.searchParams.get('link');
    const sinceTs = parseInt(url.searchParams.get('since') || '0', 10);

    // Validação: apenas caracteres seguros
    if (!paymentLinkId || !/^[a-zA-Z0-9_-]+$/.test(paymentLinkId)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Parâmetro "link" inválido ou ausente.' }));
    }

    // Token do Asaas — definido como variável de ambiente no painel da Vercel
    const token = process.env.ASAAS_TOKEN;
    if (!token) {
      console.error('[verificar-pagamento] ASAAS_TOKEN não configurado.');
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ pago: false, erro: 'Configuração do servidor ausente.' }));
    }

    // Busca TODOS os pagamentos do link (sem filtrar por status na query)
    // A filtragem por status é feita no nosso código para garantir segurança
    // Motivo: a API do Asaas pode não suportar múltiplos valores no param "status"
    const apiUrl = ASAAS_API_BASE + '/payments?paymentLink=' + encodeURIComponent(paymentLinkId) + '&limit=20';
    console.log('[verificar-pagamento] Consultando Asaas...');

    const apiRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'access_token': token,
        'Content-Type': 'application/json',
      },
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('[verificar-pagamento] Asaas HTTP ' + apiRes.status + ': ' + errText);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        pago: false,
        erro: 'API Asaas retornou HTTP ' + apiRes.status,
      }));
    }

    const json = await apiRes.json();
    const todosPagamentos = json.data || [];

    // Filtra APENAS pagamentos efetivamente recebidos/confirmados
    // E apenas pagamentos criados DEPOIS que o cliente iniciou a sessão (parâmetro since)
    // Isso evita que pagamentos antigos do mesmo link fixo sejam detectados
    const statusValidos = ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'];
    const pagamentos = todosPagamentos.filter(function (p) {
      if (statusValidos.indexOf(p.status) < 0) return false;
      if (sinceTs > 0 && p.dateCreated) {
        var dataPagamento = new Date(p.dateCreated).getTime();
        if (dataPagamento <= sinceTs) return false;
      }
      return true;
    });
    const pago = pagamentos.length > 0;

    console.log('[verificar-pagamento] Link ' + paymentLinkId + ': ' + todosPagamentos.length + ' total, ' + pagamentos.length + ' confirmados (since: ' + new Date(sinceTs).toISOString() + ')');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      pago: pago,
      total: pagamentos.length,
      todosStatus: todosPagamentos.map(function (p) { return p.status; }),
      pagamentos: pagamentos.map(function (p) {
        return {
          id: p.id,
          valor: p.value,
          status: p.status,
          data: p.paymentDate || p.confirmedDate || p.dateCreated,
          forma: p.billingType,
        };
      }),
    }));
  } catch (err) {
    console.error('[verificar-pagamento] Erro interno:', err.message);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ pago: false, erro: 'Erro interno ao verificar.' }));
  }
};
