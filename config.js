// config.js — Configuracion central y utilidades de seguridad
// Incluir DESPUES de firebase-init.js y ANTES de los scripts de cada pagina.

// ========================================
// ROLES ADMINISTRADORES (coinciden con firestore.rules)
// ========================================
const ADMIN_EMAILS = [
  "remitente2008@gmail.com",
  "jadelynsanchezf@gmail.com"
];
const ADMIN_EMAIL = ADMIN_EMAILS[0]; // admin principal

// Mes del campamento (Julio = 6, 0-indexado) — centralizado
const MES_CAMPAMENTO = 6;

function esAdmin(user) {
  return !!(user && user.email && ADMIN_EMAILS.includes(user.email));
}

// ========================================
// ESCAPE HTML — corrige XSS en renders con innerHTML
// ========================================
function escapeHtml(valor) {
  if (valor === undefined || valor === null) return "";
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
