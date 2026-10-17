const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta hacia la BD en la raíz del proyecto
const dbPath = path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos SQLite:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite.');
  }
});

// Habilitar la restricción de FK en SQLite
db.run('PRAGMA foreign_keys = ON;', (err) => {
  if (err) {
    console.error('Error al activar llaves foráneas:', err.message);
  }
});

module.exports = db;