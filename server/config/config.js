//mongodb atlas
// gabo6252@gmail.com - gabito021295*
//cafe-user - ayhSxQgd02rASfIZ


const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

//puerto
process.env.PORT = process.env.PORT || 3000

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//vencimiento del token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//seed o semilla
process.env.SEED = process.env.SEED || 'este-es-el-see-de-desarrollo'

//base de datos
let urldb
    //if (process.env.NODE_ENV === 'dev') {
    //    urldb = 'mongodb://localhost:27017/cafe'
    //} else {
urldb = 'mongodb+srv://cafe-user:ayhSxQgd02rASfIZ@cluster0-9zsfi.mongodb.net:27017/cafe?retryWrites=true'
    //}
process.env.URLDB = urldb