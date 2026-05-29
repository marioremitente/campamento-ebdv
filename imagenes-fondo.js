const imagenes = [
  "(1).png",
  "(2).png",
  "(3).png",
  "(4).png",
  "(5).png",
  "(6).png"
];

const imagenAleatoria =
  imagenes[Math.floor(Math.random() * imagenes.length)];

document.body.style.backgroundImage = `url('${imagenAleatoria}')`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundAttachment = "fixed";
document.body.style.minHeight = "100vh";