import * as SQLite from 'expo-sqlite';

// En SDK 49 se usa openDatabase
const db = SQLite.openDatabase('ecosort.db');

// Inicializar la base de datos
export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );`,
      [],
      () => console.log("Tabla usuarios lista"),
      (_, error) => console.error("Error al crear tabla", error)
    );
  });
};

// Registrar usuario
export const registrarUsuario = (email, password, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO usuarios (email, password) VALUES (?, ?)',
      [email, password],
      (_, result) => callback({ success: true, id: result.insertId }),
      (_, error) => callback({ success: false, error: "El email ya existe o hubo un error" })
    );
  });
};

// Login de usuario
export const loginUsuario = (email, password, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password],
      (_, { rows }) => {
        if (rows.length > 0) {
          callback({ success: true, user: rows.item(0) });
        } else {
          callback({ success: false });
        }
      },
      (_, error) => callback({ success: false, error })
    );
  });
};