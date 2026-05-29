// imagenes-fondo.js
// Fondo centrado y ampliado ocupando toda la pantalla

(function () {

  document.addEventListener("DOMContentLoaded", function () {

    document.body.style.backgroundImage = "url('1(1).PNG')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.minHeight = "100vh";

  });

})();