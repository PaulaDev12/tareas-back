//importacones

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();


// Cors para que permita solicitudes con los métodos y cabeceras especificados
app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));

// Configuración para solicitudes en formato JSON
app.use(bodyParser.json());


// Conexión a la base de datos con sqlite
const db = new sqlite3.Database('./tareas.db', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});


// Configuración de Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Importación y configuración de rutas
require('./routes/index')(app, db);

// Iniciar el servidor y configuración
app.listen(3000, () => {
    console.log(`servidor en puerto ${app.get('port')}`)
});
