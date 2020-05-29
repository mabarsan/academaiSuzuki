// Importaciones
const mongoose = require('mongoose');
const express = require('express')
const path = require('path');


//Configuración global
require('./config/config');

const app = express();

// Create application/json parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

// Conexión a base de datos
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.URL_BD, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos online');
});
// Inicio del servidor express
app.listen(process.env.PORT);
console.log('Servidor iniciado en puerto:' + process.env.PORT);