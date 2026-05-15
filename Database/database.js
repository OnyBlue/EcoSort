import * as SQLite from 'expo-sqlite';

// En SDK 54, abrimos la base de datos de forma síncrona o asíncrona
// openDatabaseSync es la más sencilla para migrar desde código viejo
const db = SQLite.openDatabaseSync('ecosort.db');

// Inicializar la base de datos
export const initDatabase = async () => {
  try {
    // Usamos execSync para sentencias simples como crear tablas
    db.execSync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log("Tabla usuarios lista");
  } catch (error) {
    console.error("Error al crear tabla:", error);
  }
};

// Registrar usuario
export const registrarUsuario = async (email, password, callback) => {
  try {
    // Usamos runSync para insertar datos
    const result = db.runSync(
      'INSERT INTO usuarios (email, password) VALUES (?, ?)',
      [email, password]
    );
    callback({ success: true, id: result.lastInsertRowId });
  } catch (error) {
    console.error("Error al registrar:", error);
    callback({ success: false, error: "El email ya existe o hubo un error" });
  }
};

// Login de usuario
export const loginUsuario = async (email, password, callback) => {
  try {
    // getFirstSync es ideal para buscar un solo registro (como un login)
    const row = db.getFirstSync(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password]
    );

    if (row) {
      callback({ success: true, user: row });
    } else {
      callback({ success: false });
    }
  } catch (error) {
    console.error("Error en login:", error);
    callback({ success: false, error });
  }
};