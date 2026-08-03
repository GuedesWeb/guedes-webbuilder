/**
 * POST /api/salvar-lead
 * Salva os dados do lead no KV quando o formulário de cadastro é enviado.
 * Chamado pelo frontend (iniciarPagamento) em paralelo com o webhook n8n.
 */

var kv = require('../lib/kv.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use POST.' })); }

  try {
    var body = '';
    req.on('data', function (chunk) { body += chunk; });
    await new Promise(function (resolve) { req.on('end', resolve); });

    var lead = JSON.parse(body);
    lead.id = 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    lead.criadoEm = new Date().toISOString();
    lead.etapa = 'cadastro';
    lead.pago = false;

    await kv.cmd('RPUSH', 'leads', JSON.stringify(lead));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: true, id: lead.id }));
  } catch (err) {
    console.error('[salvar-lead] Erro:', err.message);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ ok: false, erro: err.message }));
  }
};
