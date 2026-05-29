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

document.body.style.setProperty(
  "background",
  `linear-gradient(rgba(0,20,60,0.45), rgba(0,20,60,0.45)),
   url('${imagenAleatoria}') center/cover no-repeat fixed`,
  "important"
);