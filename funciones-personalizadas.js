// funciones-personalizadas.js
// Requiere que firebase-init.js esté cargado antes

// === PROTECCIÓN DE RUTAS ===
// Redirige a login.html si no hay sesión activa
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "login.html";
  }
});

// === AGREGAR HISTORIAL DE EDICIÓN ===
function agregarHistorialEdicion(nuevosDatos, datosAnteriores, idDocumento) {
  const historialRef = db.collection("historial_ediciones");
  for (const campo in nuevosDatos) {
    if (nuevosDatos[campo] !== datosAnteriores[campo]) {
      historialRef.add({
        campo: campo,
        antes: datosAnteriores[campo] ?? "",
        despues: nuevosDatos[campo],
        editadoPor: firebase.auth().currentUser?.email || "desconocido",
        editadoEn: firebase.firestore.Timestamp.now(),
        idDocumento: idDocumento
      }).catch(err => console.error("Error al guardar historial:", err));
    }
  }
}

// === MOSTRAR HISTORIAL EN historial.html ===
function mostrarHistorial() {
  const tabla = document.getElementById("contenidoHistorial");
  if (!tabla) return;

  tabla.innerHTML = "<tr><td colspan='6' class='text-center'>Cargando...</td></tr>";

  db.collection("historial_ediciones")
    .orderBy("editadoEn", "desc")
    .get()
    .then(snapshot => {
      tabla.innerHTML = "";

      if (snapshot.empty) {
        tabla.innerHTML = "<tr><td colspan='6' class='text-center'>No hay registros de cambios.</td></tr>";
        return;
      }

      snapshot.forEach(doc => {
        const d = doc.data();
        const fecha = d.editadoEn?.toDate
          ? d.editadoEn.toDate().toLocaleString("es-DO")
          : "Sin fecha";

        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${d.idDocumento || "-"}</td>
          <td>${d.campo || "-"}</td>
          <td>${d.antes || "-"}</td>
          <td>${d.despues || "-"}</td>
          <td>${d.editadoPor || "-"}</td>
          <td>${fecha}</td>
        `;
        tabla.appendChild(fila);
      });
    })
    .catch(err => {
      console.error("Error al cargar historial:", err);
      tabla.innerHTML = "<tr><td colspan='6' class='text-center text-danger'>Error al cargar historial.</td></tr>";
    });
}

// === RESPALDO AUTOMÁTICO AL CREAR UN REGISTRO ===
function guardarConRespaldo(nuevoRegistro) {
  return db.collection("niños")
    .add(nuevoRegistro)
    .then(docRef => {
      return db.collection("respaldo_niños").add({
        ...nuevoRegistro,
        originalId: docRef.id,
        copiadoEn: firebase.firestore.Timestamp.now(),
        copiaDe: "niños"
      });
    });
}

// === RESPALDO MANUAL DE TODOS LOS REGISTROS ===
function respaldarTodo() {
  db.collection("niños").get().then(snapshot => {
    const promesas = [];
    snapshot.forEach(doc => {
      promesas.push(
        db.collection("respaldo_niños").add({
          ...doc.data(),
          originalId: doc.id,
          copiadoEn: firebase.firestore.Timestamp.now()
        })
      );
    });
    return Promise.all(promesas);
  })
  .then(() => alert("Respaldo completo realizado."))
  .catch(err => {
    console.error("Error en respaldo:", err);
    alert("Error al hacer respaldo.");
  });
}

// === CERRAR SESIÓN ===
function cerrarSesion() {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
}
