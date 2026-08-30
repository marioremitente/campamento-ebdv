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

// ========================================
// RECALCULAR RESUMEN PUBLICO (SOLO TOTALES, sin datos personales)
// ========================================
// Lee la coleccion "ninos" y guarda en "stats_publicas/resumen" únicamente
// conteos agregados (números). NUNCA guarda nombres, apellidos, responsables
// ni condiciones de salud. Llamar tras registrar/editar/eliminar/respaldar.
function recalcularResumenPublico() {
  return db.collection("ninos").get().then(function(snapshot) {
    // Estructura por anio: cada anio guarda su desglose completo (solo numeros).
    var resumen = {
      total: 0,
      porAnio: {},
      actualizadoEn: firebase.firestore.Timestamp.now()
    };

    function nuevoAnio() {
      return {
        total: 0,
        primera: 0,
        segunda: 0,
        porEdad: {},
        conBrazalete: 0,
        sinBrazalete: 0,
        requiereAtencion: 0,
        sinAtencion: 0
      };
    }

    snapshot.forEach(function(doc) {
      var d = doc.data();
      resumen.total++;

      var anio = d.anio ? String(d.anio) : "sin_anio";
      if (!resumen.porAnio[anio]) resumen.porAnio[anio] = nuevoAnio();
      var y = resumen.porAnio[anio];
      y.total++;

      var tanda = (d.tanda || "").toLowerCase();
      if (tanda === "primera") y.primera++;
      else if (tanda === "segunda") y.segunda++;

      var edad = (d.edad !== undefined && d.edad !== null) ? String(d.edad) : "sin_edad";
      y.porEdad[edad] = (y.porEdad[edad] || 0) + 1;

      if (d.tieneBrazalete === "si") y.conBrazalete++;
      else y.sinBrazalete++;

      if (d.requiereAtencionEspecial === "si") y.requiereAtencion++;
      else y.sinAtencion++;
    });

    return db.collection("stats_publicas").doc("resumen").set(resumen);
  }).catch(function(err) {
    console.error("Error recalcular resumen publico:", err);
  });
}
