import { db } from '../firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

const COLLECTION_NAME = "reportes_reciclaje";

export const ResiduoService = {
  /**
   * LEER (Read): Se suscribe a los cambios en tiempo real.
   * @param {function} callback - Función que se ejecuta cada vez que hay datos nuevos.
   */
  subscribe: (callback) => {
    const q = query(collection(db, COLLECTION_NAME), orderBy("fecha", "desc"));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        // Convertimos el timestamp de Firebase a una fecha legible de JS
        fechaFormateada: d.data().fecha?.toDate().toLocaleString() || 'Pendiente...'
      }));
      callback(data);
    });
  },

  /**
   * CREAR (Create): Registra un nuevo evento de reciclaje.
   */
  create: async (contenedor, nivel, accion) => {
    try {
      return await addDoc(collection(db, COLLECTION_NAME), {
        contenedor,
        nivel,
        fecha: serverTimestamp(),
        tipo_accion: accion
      });
    } catch (error) {
      console.error("Error en ResiduoService (create):", error);
      throw error;
    }
  },

  /**
   * ACTUALIZAR (Update): Modifica un registro existente.
   */
  update: async (id, nuevoNivel) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      return await updateDoc(docRef, { nivel: parseInt(nuevoNivel) });
    } catch (error) {
      console.error("Error en ResiduoService (update):", error);
      throw error;
    }
  },

  /**
   * BORRAR (Delete): Elimina un registro.
   */
  delete: async (id) => {
    try {
      return await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error en ResiduoService (delete):", error);
      throw error;
    }
  }
};