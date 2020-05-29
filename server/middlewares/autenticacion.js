const jwt = require('jsonwebtoken');
require('../config/config');

// Verifica si un Token es valido
let verificaToken = (req, res, next) => {

    let token = req.get('token'); // nombre del headrer

    jwt.verify(token, process.env.SEED_TOKEN, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: err
            });
        }

        req.usuario = decode.usuario;
        next();
    });
};


//Varifica el rol del usuario Admin o superior
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario.role);
    console.log(usuario.role === 'ADMIN_ROLE' || usuario.role === 'SUPER_ROLE');
    if (usuario.role === 'ADMIN_ROLE' || usuario.role === 'SUPER_ROLE') {

        next();

    } else {
        res.status(401).json({
            ok: false,
            error: 'Usuario sin premisos para realiza la acción solicitada'
        });
    }
};

//Varifica el rol del usuario Supe
let verificaSuperRole = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role != 'SUPER_ROLE') {
        res.status(401).json({
            ok: false,
            error: 'Usuario sin premisos para realiza la acción solicitada'
        });
    } else {
        next();
    }
};

module.exports = {
    verificaAdminRole,
    verificaSuperRole,
    verificaToken
}