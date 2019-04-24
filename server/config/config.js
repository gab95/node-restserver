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
process.env.CADUCIDAD_TOKEN = '48h'

//seed o semilla
process.env.SEED = process.env.SEED || 'este-es-el-see-de-desarrollo'

//google client
process.env.CLIENTID = process.env.CLIENTID || '1017670000825-56v24hubqpuec9rrt1aclh03h5luud9l.apps.googleusercontent.com'


//base de datos
let urldb
    //if (process.env.NODE_ENV === 'dev') {
    //    urldb = 'mongodb://localhost:27017/cafe'
    //} else {
urldb = 'mongodb+srv://cafe-user:ayhSxQgd02rASfIZ@cluster0-9zsfi.mongodb.net:27017/cafe?retryWrites=true'
    //}
process.env.URLDB = urldb