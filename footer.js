// footer.js — Pie de página común para todas las páginas
// Incluir este archivo en todos los HTML antes del cierre de </body>

document.addEventListener("DOMContentLoaded", function () {
  const footer = document.createElement("footer");
  footer.className = "text-center text-secondary mt-5 pt-4 pb-3";
  footer.style.borderTop = "1px solid #333";
  footer.style.fontSize = "0.8rem";
  footer.innerHTML = `
    &copy; ${new Date().getFullYear()} Mario Feliz. Todos los derechos reservados.<br>
    El uso no autorizado de este sistema o su contenido sin el consentimiento del autor
    puede ser considerado una violación legal y está sujeto a sanciones.<br>
    Para consultas o permisos, contactar al <strong>809-208-3789</strong>
    o por correo a <a href="mailto:marioremitente@gmail.com" class="text-secondary">marioremitente@gmail.com</a>
  `;
  document.body.appendChild(footer);
});
