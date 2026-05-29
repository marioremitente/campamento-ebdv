// imagenes-fondo.js
// Inserta automáticamente las imágenes decorativas en las esquinas

(function() {
  const pagina = window.location.pathname.split("/").pop();

  // Páginas que usarán el grupo 1
  const usaImg1 = ["login.html", "index_registro.html", "carga-masiva.html"];

  // Reparto personalizado usando tus archivos reales
  const imagenes = usaImg1.includes(pagina)
    ? {
        topLeft: "1(1).PNG",
        topRight: "1(2).PNG",
        bottomLeft: "1(3).PNG",
        bottomRight: "1(4).PNG",
        fondo: "1(5).PNG"
      }
    : {
        topLeft: "1(2).PNG",
        topRight: "1(3).PNG",
        bottomLeft: "1(4).PNG",
        bottomRight: "1(5).PNG",
        fondo: "1(6).PNG"
      };

  // Crear contenedor
  const div = document.createElement("div");
  div.className = "esquinas-fondo";

  div.innerHTML = `
    <img src="${imagenes.topLeft}" class="top-left" alt="">
    <img src="${imagenes.topRight}" class="top-right" alt="">
    <img src="${imagenes.bottomLeft}" class="bottom-left" alt="">
    <img src="${imagenes.bottomRight}" class="bottom-right" alt="">
  `;

  // Insertar en el body
  if (document.body) {
    document.body.insertBefore(div, document.body.firstChild);
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      document.body.insertBefore(div, document.body.firstChild);
    });
  }

  // Fondo especial para login
  if (pagina === "login.html") {
    document.addEventListener("DOMContentLoaded", function() {
      document.body.style.backgroundImage = `url('${imagenes.fondo}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundAttachment = "fixed";
    });
  }
})();