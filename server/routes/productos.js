const express = require('express')

let { verificaToken } = require('../middlewares/autenticacion')

let app = express()

let Producto = require('../models/productos')

//mostrar todas los productos
app.get('/producto', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                })
            })
        })
})

//mostrar los productos por id
app.get('/producto/:id', (req, res) => {
    let id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productodb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productodb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el id no es valido'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productodb
            })
        })
});


// añadir un nuevo producto
app.post('/producto', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.res._id

    let body = req.body
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    })

    producto.save((err, productodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productodb
        })
    })
});


//actualizar un producto
app.put('/producto/:id', (req, res) => {
    let id = req.params.id
    let body = req.body

    Producto.findById(id, (err, productodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productodb) {
            return res.status(400).json({
                ok: false,
                err: { message: 'el id no existe' }
            })
        }

        productodb.nombre = body.nombre
        productodb.precioUni = body.precioUni
        productodb.categoria = body.categoria
        productodb.disponible = body.disponible
        productodb.descripcion = body.descripcion

        productodb.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })

    })
})


//buscar producto
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    let regexp = new RegExp(termino, 'i')

    Producto.find({ nombre: regexp })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productos
            })
        })
});





//crear nuevo producto
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.res._id

    let body = req.body
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriadb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriadb
        })
    })
})



app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id
        //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: { message: 'el id no existe' }
            })
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'producto borrado'
        })
    })
})


module.exports = app