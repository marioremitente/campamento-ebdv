const imagenes = [
  "bg1.png",
  "bg2.png",
  "bg3.png",
  "bg4.png",
  "bg5.png",
  "bg6.png"
];

const imagenAleatoria =
  imagenes[Math.floor(Math.random() * imagenes.length)];

document.body.style.background =
  `linear-gradient(rgba(0,20,60,0.45), rgba(0,20,60,0.45)),
   url('${imagenAleatoria}')`;

document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundAttachment = "fixed";