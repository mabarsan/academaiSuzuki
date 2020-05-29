const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const Usuario = require('../model/usuario');
const app = express();
const { verificaToken, verificaAdminRole, verificaSuperRole } = require('../middlewares/autenticacion');

//Listado de usuarios (Token necesario)
app.get('/usuarios', [verificaToken], (req, res) => {

    let usuarioPagina = req.params.limite || 10;
    let pagina = req.params.pag * usuarioPagina ||  0;

    Usuario.find()
        .limit(usuarioPagina)
        .skip(pagina)
        .then(usuarios => {

            if (!usuarios) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'NO ha sido posible añadir al usuario'
                    }
                });
            }

            res.json({
                ok: true,
                usuarios
            });

        }).catch(err => {
            return res.status(500).json({
                ok: false,
                error: err
            });
        });
});

//Creacion de usuario (Token necesario + ADMIN_ROLE o superior)
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
    });

    usuario.save().then(usuarioDb => {
        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'NO ha sido posible acceder a los datos'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDb
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    });
});

//Actualiza usuario (Token necesario + ADMIN_ROLE o superior)
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'apellidos', 'password', 'avatar']);
    if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }).then(usuario => {
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'NO ha sido posible actualizar al usuario'
                }
            });
        }
        res.json({
            ok: true,
            usuario
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    })

});

//Elimina usuario (Token necesario + SUPER_ROLE o superior)
app.delete('/usuario/:id', [verificaToken, verificaSuperRole], (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }).then(usuario => {
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'NO ha sido posible desactivar al usuario'
                }
            });
        }
        res.json({
            ok: true,
            usuario
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    });


});

// Login de usuario (Posiblemente se centralice con un sw para determinar el tipo de login (Usuario, Alumno o Profesor))
app.post('/usuario/login', async(req, res) => {

    let body = req.body;
    let usuario = await Usuario.findOne({ email: body.email });

    if (!usuario) {
        return res.status(400).json({
            ok: false,
            err: 'Usuaio o contraseña incorrecta'
        });
    } else {
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuaio o contraseña incorrecta'
            });
        }

        let token = jwt.sign({
            usuario
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
            ok: true,
            usuario,
            token
        });
    }
});



module.exports = app;