const jwt = require('jsonwebtoken')


//verificar token
let verificaToken = (req, res, next) => {
    let token = req.get('token')
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        }
        req.usuario = decoded.usuario
        next()
    })
}

//verifica el rol del usuario que se admin_role
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}