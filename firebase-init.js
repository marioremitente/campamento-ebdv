// firebase-init.js — Inicializacion unica de Firebase
// Incluir este archivo ANTES de cualquier otro script en todas las paginas
 
if (!firebase.apps.length) {
  var firebaseConfig = {
    apiKey: "AIzaSyDLzjQyP2O_s9s1F8eZVCibtPjbw66-DDg",
    authDomain: "campamento-ebdv.firebaseapp.com",
    projectId: "campamento-ebdv",
    storageBucket: "campamento-ebdv.appspot.com",
    messagingSenderId: "607613014750",
    appId: "1:607613014750:web:f3a86225901b9c728a684f"
  };
  firebase.initializeApp(firebaseConfig);
}
 
// Variables globales accesibles en todos los archivos
var auth = firebase.auth();
var db = firebase.firestore();
 
