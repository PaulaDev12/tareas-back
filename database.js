const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join('D:', 'OneDrive', 'Documentos', 'sqlite', 'tareas');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con SQLite', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

module.exports = db;
