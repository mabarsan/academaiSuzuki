const express = require('express');
const app = express();

app.use(require('./usuarios'));
app.use(require('./profesores'));
app.use(require('./alumnos'));


module.exports = app;