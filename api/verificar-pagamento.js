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

export default async function handler(req, res) {
  // CORS — permite chamadas do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido. Use GET.' });
  }

  try {
    // Extrai o parâmetro "link" da query string
    const url = new URL(req.url, 'http://localhost');
    const paymentLinkId = url.searchParams.get('link');

    // Validação: apenas caracteres seguros
    if (!paymentLinkId || !/^[a-zA-Z0-9_-]+$/.test(paymentLinkId)) {
      return res.status(400).json({ erro: 'Parâmetro "link" inválido ou ausente.' });
    }

    // Token do Asaas — definido como variável de ambiente no painel da Vercel
    const token = process.env.ASAAS_TOKEN;
    if (!token) {
      console.error('[verificar-pagamento] ASAAS_TOKEN não configurado.');
      return res.status(500).json({ pago: false, erro: 'Configuração do servidor ausente.' });
    }

    // Consulta pagamentos confirmados no link
    const apiUrl = `${ASAAS_API_BASE}/payments?paymentLink=${encodeURIComponent(paymentLinkId)}&status=RECEIVED&status=CONFIRMED&limit=5`;
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
      console.error(`[verificar-pagamento] Asaas HTTP ${apiRes.status}: ${errText}`);
      return res.status(200).json({
        pago: false,
        erro: `API Asaas retornou HTTP ${apiRes.status}`,
      });
    }

    const json = await apiRes.json();
    const pagamentos = json.data || [];
    const pago = pagamentos.length > 0;

    console.log(`[verificar-pagamento] Link ${paymentLinkId}: ${pagamentos.length} pagamento(s)`);

    return res.status(200).json({
      pago,
      total: pagamentos.length,
      pagamentos: pagamentos.map(p => ({
        id: p.id,
        valor: p.value,
        status: p.status,
        data: p.paymentDate || p.confirmedDate || p.dateCreated,
        forma: p.billingType,
      })),
    });
  } catch (err) {
    console.error('[verificar-pagamento] Erro interno:', err.message);
    return res.status(200).json({ pago: false, erro: 'Erro interno ao verificar.' });
  }
}
