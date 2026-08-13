/**
 * GET /api/admin-leads
 * Retorna todos os leads cadastrados. Requer token de admin.
 *
 * Headers:
 *   Authorization: Bearer <token>
 */

var kv = require('../lib/kv.js');
var adminLogin = require('./admin-login.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'GET') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use GET.' })); }

  try {
    // Verificar token
    var auth = req.headers.authorization || '';
    var token = auth.replace('Bearer ', '').trim();
    if (!adminLogin.validarToken(token)) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Não autorizado. Faça login novamente.' }));
    }

    // Buscar leads do KV
    var raw = await kv.cmd('LRANGE', 'leads', '0', '-1');
    var leads = (raw || []).map(function (item) {
      try { return JSON.parse(item); } catch (e) { return null; }
    }).filter(Boolean);

    // Ordenar do mais recente pro mais antigo
    leads.reverse();

    // Enriquece cada lead com os dados de acesso ao CMS (email, senha, site)
    await Promise.all(leads.map(async function (l) {
      try {
        var email = (l.email || '').trim().toLowerCase();
        if (!email) return;
        var rawUser = await kv.cmd('GET', 'cms-user:' + email);
        if (!rawUser) return;
        var user = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
        var cms = { email: email, senha: user.senha || '', slug: user.slug || '', siteUrl: '', vercelProject: '' };
        if (user.slug) {
          var rawSite = await kv.cmd('GET', 'site:' + user.slug);
          if (rawSite) {
            var site = typeof rawSite === 'string' ? JSON.parse(rawSite) : rawSite;
            cms.siteUrl = site.siteUrl || '';
            cms.vercelProject = site.vercelProject || '';
          }
        }
        l.cms = cms;
      } catch (e) { /* segue sem dados do CMS */ }
    }));

    // Resumo
    var total = leads.length;
    var pagos = leads.filter(function (l) { return l.pago; }).length;
    var pendentes = total - pagos;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      total: total,
      pagos: pagos,
      pendentes: pendentes,
      leads: leads,
    }));
  } catch (err) {
    console.error('[admin-leads] Erro:', err.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro ao buscar leads: ' + err.message }));
  }
};
