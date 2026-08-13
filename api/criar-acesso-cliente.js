/**
 * POST /api/criar-acesso-cliente
 * Cria (ou atualiza) o acesso do cliente ao CMS automaticamente,
 * chamado pelo WebBuilder logo após a publicação do site na Vercel.
 *
 * Body: { email, nome, studio, cpfCnpj?, edits?, customCode?, vercelProject?, siteUrl? }
 * Retorna: { criado: true, email, senha, slug } | { existente: true, email, slug }
 */

var kv = require('../lib/kv.js');
var auth = require('../lib/auth.js');

var LIMITE_BODY = 4200000; // ~4,2MB (limite da Vercel ~4,5MB por request)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ erro: 'Use POST.' })); }

  try {
    var body = '';
    req.on('data', function (c) { body += c; });
    await new Promise(function (r) { req.on('end', r); });

    if (body.length > LIMITE_BODY) {
      res.statusCode = 413;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'corpo muito grande' }));
    }

    var d = JSON.parse(body);
    var email = (d.email || '').trim().toLowerCase();
    var nome = (d.nome || '').trim();
    var studio = (d.studio || '').trim();
    var cpfCnpj = (d.cpfCnpj || '').replace(/\D/g, '');

    if (!email || !nome || !studio) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ erro: 'Email, nome e estúdio obrigatórios.' }));
    }

    var slug = auth.slugify(studio);
    var rawUser = await kv.cmd('GET', 'cms-user:' + email);
    var existente = !!rawUser;

    // Se já existe usuário com outro estúdio, aponta para o novo slug
    if (existente) {
      try {
        var userAntigo = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
        if (userAntigo.slug !== slug) {
          userAntigo.slug = slug;
          await kv.cmd('SET', 'cms-user:' + email, JSON.stringify(userAntigo));
        }
      } catch (e) {}
    }

    // Monta (ou atualiza) o documento do site preservando dados anteriores
    var rawSite = await kv.cmd('GET', 'site:' + slug);
    var antigo = rawSite ? (typeof rawSite === 'string' ? JSON.parse(rawSite) : rawSite) : {};
    var siteDoc = {
      slug: slug,
      nome: nome,
      email: email,
      studio: studio,
      cpfCnpj: cpfCnpj,
      edits: d.edits || antigo.edits || null,
      customCode: d.customCode || antigo.customCode || null,
      vercelProject: d.vercelProject || antigo.vercelProject || '',
      siteUrl: d.siteUrl || antigo.siteUrl || '',
      criadoEm: antigo.criadoEm || new Date().toISOString(),
      publicadoEm: new Date().toISOString(),
    };
    await kv.cmd('SET', 'site:' + slug, JSON.stringify(siteDoc));

    if (existente) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ existente: true, email: email, slug: slug }));
    }

    var senha = auth.gerarSenha();
    var hash = auth.hashSenha(senha);
    var userDoc = { email: email, slug: slug, nome: nome, studio: studio, passwordHash: hash, criadoEm: new Date().toISOString() };
    await kv.cmd('SET', 'cms-user:' + email, JSON.stringify(userDoc));
    await kv.cmd('RPUSH', 'clients', email);

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ criado: true, email: email, senha: senha, slug: slug, studio: studio }));
  } catch (e) {
    console.error('[criar-acesso-cliente]', e.message);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ erro: 'Erro interno.' }));
  }
};
