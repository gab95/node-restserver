require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//habilitar la carpeta public que contiene la pagina html
app.use(express.static(path.resolve(__dirname, '../public')))

app.use(require('./routes/index'))

mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});
app.listen(process.env.PORT)