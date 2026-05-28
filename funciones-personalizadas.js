// funciones-personalizadas.js
// Requiere que firebase-init.js este cargado antes

// === PROTECCION DE RUTAS ===
// Redirige a login.html si no hay sesion activa
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "login.html";
  }
});

// === AGREGAR HISTORIAL DE EDICION ===
function agregarHistorialEdicion(nuevosDatos, datosAnteriores, idDocumento) {
  var historialRef = db.collection("historial_ediciones");
  for (var campo in nuevosDatos) {
    if (nuevosDatos[campo] !== datosAnteriores[campo]) {
      historialRef.add({
        campo: campo,
        antes: datosAnteriores[campo] !== undefined ? datosAnteriores[campo] : "",
        despues: nuevosDatos[campo],
        editadoPor: firebase.auth().currentUser ? firebase.auth().currentUser.email : "desconocido",
        editadoEn: firebase.firestore.Timestamp.now(),
        idDocumento: idDocumento
      }).catch(function(err) { console.error("Error al guardar historial:", err); });
    }
  }
}

// === MOSTRAR HISTORIAL EN historial.html ===
function mostrarHistorial() {
  var tabla = document.getElementById("contenidoHistorial");
  if (!tabla) return;

  tabla.innerHTML = "<tr><td colspan='6' class='text-center'>Cargando...</td></tr>";

  db.collection("historial_ediciones")
    .orderBy("editadoEn", "desc")
    .get()
    .then(function(snapshot) {
      tabla.innerHTML = "";

      if (snapshot.empty) {
        tabla.innerHTML = "<tr><td colspan='6' class='text-center'>No hay registros de cambios.</td></tr>";
        return;
      }

      snapshot.forEach(function(doc) {
        var d = doc.data();
        var fecha = (d.editadoEn && d.editadoEn.toDate)
          ? d.editadoEn.toDate().toLocaleString("es-DO")
          : "Sin fecha";

        var fila = document.createElement("tr");
        fila.innerHTML =
          "<td>" + (d.idDocumento || "-") + "</td>" +
          "<td>" + (d.campo || "-") + "</td>" +
          "<td>" + (d.antes || "-") + "</td>" +
          "<td>" + (d.despues || "-") + "</td>" +
          "<td>" + (d.editadoPor || "-") + "</td>" +
          "<td>" + fecha + "</td>";
        tabla.appendChild(fila);
      });
    })
    .catch(function(err) {
      console.error("Error al cargar historial:", err);
      tabla.innerHTML = "<tr><td colspan='6' class='text-center text-danger'>Error al cargar historial.</td></tr>";
    });
}

// === RESPALDO AUTOMATICO AL CREAR UN REGISTRO ===
// Usa la coleccion "ninos" (sin tilde ni enie)
function guardarConRespaldo(nuevoRegistro) {
  return db.collection("ninos")
    .add(nuevoRegistro)
    .then(function(docRef) {
      var respaldo = Object.assign({}, nuevoRegistro, {
        originalId: docRef.id,
        copiadoEn: firebase.firestore.Timestamp.now(),
        copiaDe: "ninos"
      });
      return db.collection("respaldo_ninos").add(respaldo);
    });
}

// === RESPALDO MANUAL DE TODOS LOS REGISTROS ===
// Usa la coleccion "ninos" (sin tilde ni enie)
function respaldarTodo() {
  db.collection("ninos").get().then(function(snapshot) {
    var promesas = [];
    snapshot.forEach(function(doc) {
      var respaldo = Object.assign({}, doc.data(), {
        originalId: doc.id,
        copiadoEn: firebase.firestore.Timestamp.now()
      });
      promesas.push(db.collection("respaldo_ninos").add(respaldo));
    });
    return Promise.all(promesas);
  })
  .then(function() { alert("Respaldo completo realizado."); })
  .catch(function(err) {
    console.error("Error en respaldo:", err);
    alert("Error al hacer respaldo.");
  });
}

// === CERRAR SESION ===
function cerrarSesion() {
  firebase.auth().signOut().then(function() {
    window.location.href = "login.html";
  });
}