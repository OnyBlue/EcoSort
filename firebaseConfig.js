import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tus credenciales de EcoSort
const firebaseConfig = {
  apiKey: "AIzaSyBJrR1arl2p7dw3CRYJvkBNukSG3iHyUT0",
  authDomain: "ecosort-2df8a.firebaseapp.com",
  projectId: "ecosort-2df8a",
  storageBucket: "ecosort-2df8a.firebasestorage.app",
  messagingSenderId: "6269784885",
  appId: "1:6269784885:web:039a9309706cc6be96b27c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la base de datos para usarla en HomeScreen.js, etc.
export const db = getFirestore(app);