const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENTID)

const Usuario = require('../models/usuario')

const app = express()

//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload()

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken
    let googleUser = await verify(token)
        .catch((e) => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuariodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuariodb) {
            if (usuariodb.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe usar su autenticacion normal'
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuariodb
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuariodb,
                    token
                })
            }
        } else {
            //si el usuario no existe en nuestra base de datos
            let usuario = new Usuario()
            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = ':)'

            usuario.save((err, usuariodb) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuariodb
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    usuario: usuariodb,
                    token
                })
            })
        }
    })
})



app.post('/login', (req, res) => {
    let body = req.body
    Usuario.findOne({ email: body.email }, (err, usuariodb) => {
        //compara si el usuario existe
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //compara si el email es correcto
        if (!usuariodb) {
            return res.status(400).json({
                ok: false,
                message: '(usuario) o contraseña incorrectos'
            })
        }

        //compara si la contraseña es correcta
        if (!bcrypt.compareSync(body.password, usuariodb.password)) {
            return res.status(400).json({
                ok: false,
                message: 'usuario o (contraseña) incorrectos'
            })
        }

        //token
        let token = jwt.sign({
            usuario: usuariodb
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usuario: usuariodb,
            token
        })
    })
})









module.exports = app