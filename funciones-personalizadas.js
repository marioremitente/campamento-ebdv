// funciones-personalizadas.js
// Requiere firebase-init.js antes

// ========================================
// PROTECCION DE RUTAS
// ========================================
firebase.auth().onAuthStateChanged(function(user) {

  var paginaActual =
    window.location.pathname.split("/").pop();

  // Evita loop infinito en login
  if (!user && paginaActual !== "login.html") {

    window.location.href = "login.html";
  }
});

// ========================================
// AGREGAR HISTORIAL DE EDICION
// ========================================
function agregarHistorialEdicion(
  nuevosDatos,
  datosAnteriores,
  idDocumento
) {

  var historialRef =
    db.collection("historial_ediciones");

  for (var campo in nuevosDatos) {

    var valorAnterior =
      datosAnteriores[campo];

    var valorNuevo =
      nuevosDatos[campo];

    // Normalizar undefined/null
    if (valorAnterior === undefined || valorAnterior === null) {
      valorAnterior = "";
    }

    if (valorNuevo === undefined || valorNuevo === null) {
      valorNuevo = "";
    }

    // Comparacion segura
    if (String(valorAnterior) !== String(valorNuevo)) {

      historialRef.add({

        campo: campo,

        antes: valorAnterior,

        despues: valorNuevo,

        editadoPor:
          firebase.auth().currentUser
            ? firebase.auth().currentUser.email
            : "desconocido",

        editadoEn:
          firebase.firestore.Timestamp.now(),

        idDocumento: idDocumento

      })

      .catch(function(err) {

        console.error(
          "Error al guardar historial:",
          err
        );

      });
    }
  }
}

// ========================================
// MOSTRAR HISTORIAL
// ========================================
function mostrarHistorial() {

  var tabla =
    document.getElementById(
      "contenidoHistorial"
    );

  if (!tabla) return;

  tabla.innerHTML =

    "<tr>" +

    "<td colspan='6' class='text-center'>" +

    "Cargando..." +

    "</td>" +

    "</tr>";

  db.collection("historial_ediciones")

    .orderBy("editadoEn", "desc")

    .get()

    .then(function(snapshot) {

      tabla.innerHTML = "";

      if (snapshot.empty) {

        tabla.innerHTML =

          "<tr>" +

          "<td colspan='6' class='text-center'>" +

          "No hay registros de cambios." +

          "</td>" +

          "</tr>";

        return;
      }

      snapshot.forEach(function(doc) {

        var d = doc.data();

        var fecha =

          (
            d.editadoEn &&
            d.editadoEn.toDate
          )

          ? d.editadoEn
              .toDate()
              .toLocaleString("es-DO")

          : "Sin fecha";

        var fila =
          document.createElement("tr");

        fila.innerHTML =

          "<td>" +

          (d.idDocumento || "-") +

          "</td>" +

          "<td>" +

          (d.campo || "-") +

          "</td>" +

          "<td class='text-danger'>" +

          (d.antes || "-") +

          "</td>" +

          "<td class='text-success'>" +

          (d.despues || "-") +

          "</td>" +

          "<td>" +

          (d.editadoPor || "-") +

          "</td>" +

          "<td>" +

          fecha +

          "</td>";

        tabla.appendChild(fila);

      });

    })

    .catch(function(err) {

      console.error(
        "Error al cargar historial:",
        err
      );

      tabla.innerHTML =

        "<tr>" +

        "<td colspan='6' class='text-center text-danger'>" +

        "Error al cargar historial." +

        "</td>" +

        "</tr>";
    });
}

// ========================================
// GUARDAR CON RESPALDO
// ========================================
function guardarConRespaldo(
  nuevoRegistro
) {

  return db.collection("ninos")

    .add(nuevoRegistro)

    .then(function(docRef) {

      var respaldo = Object.assign(
        {},
        nuevoRegistro,
        {

          originalId: docRef.id,

          copiadoEn:
            firebase.firestore.Timestamp.now(),

          copiaDe: "ninos"

        }
      );

      return db.collection(
        "respaldo_ninos"
      ).add(respaldo);

    })

    .catch(function(err) {

      console.error(
        "Error guardando respaldo:",
        err
      );

      throw err;
    });
}

// ========================================
// RESPALDAR TODO
// ========================================
function respaldarTodo() {

  db.collection("ninos")

    .get()

    .then(function(snapshot) {

      var promesas = [];

      snapshot.forEach(function(doc) {

        var respaldo = Object.assign(
          {},
          doc.data(),
          {

            originalId: doc.id,

            copiadoEn:
              firebase.firestore.Timestamp.now()

          }
        );

        promesas.push(

          db.collection("respaldo_ninos")
            .add(respaldo)

        );

      });

      return Promise.all(promesas);

    })

    .then(function() {

      alert(
        "Respaldo completo realizado."
      );

    })

    .catch(function(err) {

      console.error(
        "Error en respaldo:",
        err
      );

      alert(
        "Error al hacer respaldo."
      );

    });
}

// ========================================
// CERRAR SESION
// ========================================
function cerrarSesion() {

  firebase.auth()

    .signOut()

    .then(function() {

      window.location.href =
        "login.html";

    })

    .catch(function(err) {

      console.error(
        "Error cerrando sesion:",
        err
      );

    });
}