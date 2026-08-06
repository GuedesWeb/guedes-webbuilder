/**
 * Helpers compartilhados para autenticação do CMS.
 */

var crypto = require('crypto');

function hashSenha(senha) {
  return crypto.createHash('sha256').update('guedes-cms-' + senha).digest('hex');
}

function gerarSenha() {
  var chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  var senha = '';
  for (var i = 0; i < 10; i++) {
    senha += chars[Math.floor(Math.random() * chars.length)];
  }
  return senha;
}

function slugify(s) {
  return (s || 'cliente')
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'cliente';
}

module.exports = { hashSenha, gerarSenha, slugify };
