const express = require('express')

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

let app = express()

let Categoria = require('../models/categoria')

//mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        })
})


//actualizar una categoria
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Categoria.findById(id, (err, categoriadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriadb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no es valido'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriadb
        })
    })

})


//editar info de una categoria
app.put('/categoria/:id', (req, res) => {
    //Categoria.findById
    let id = req.params.id
    let body = req.body

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriadb) => {
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



//crear nueva categoria
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




//borrar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id
    Categoria.findByIdAndRemove(id, (err, categoriadb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriadb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'categoria borrada'
        })
    })


});



module.exports = app