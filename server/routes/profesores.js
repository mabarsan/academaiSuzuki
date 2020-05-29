const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const Profesor = require('../model/profesor');
const app = express();
const { verificaToken, verificaAdminRole, verificaSuperRole } = require('../middlewares/autenticacion');

//Listado de profesores
app.get('/profesores', [verificaToken], (req, res) => {

    let limite = req.params.limit || 10;
    let pagina = req.params.pag || 0;

    let pag = pagina * limite

    Profesor.find()
        .limit(limite)
        .skip(pag)
        .then(profesores => {
            if (!profesores) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'No se han obtenido datos'
                    }
                });
            }
            res.json({
                ok: true,
                profesores
            });

        }).catch(err => {
            return res.status(500).json({
                ok: false,
                error: err
            });
        });
});

//Crear profesor
app.post('/profesor', [verificaToken], (req, res) => {

    let body = req.body;

    let profesor = new Profesor({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        telefono: body.telefono,
        direccion: body.direccion,
        cp: body.cp,
        avatar: body.avatar,
        password: bcrypt.hashSync(body.password, 10),
    });

    profesor.save().then(profesorDb => {
        if (!profesorDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se ha almacenado el profesor'
                }
            });
        }

        res.json({
            ok: true,
            profesor: profesorDb
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    });
});

//Actualizar profesor por ID
app.put('/profesor/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'apellidos', 'password', 'avatar', 'direccion', 'cp', 'telefono', 'estado']);

    Profesor.findByIdAndUpdate(id, body, { new: true, runValidators: true }).then(profesor => {
        if (!profesor) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se ha encontrado la id del profesor'
                }
            });
        }

        res.json({
            ok: true,
            profesor
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    })

});

//Eliminar profesor por ID
app.delete('/profesor/:id', [verificaToken, verificaSuperRole], (req, res) => {
    let id = req.params.id;
    Profesor.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }).then(profesor => {
        if (!profesor) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se ha encontrado la id del profesor'
                }
            });
        }

        res.json({
            ok: true,
            profesor
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    })

});

// Login de usuario (Posiblemente se centralice con un sw para determinar el tipo de login (Usuario, Alumno o Profesor))
app.post('/profesor/login', async(req, res) => {

    let body = req.body;
    let profesor = await Profesor.findOne({ email: body.email });

    if (!profesor) {
        return res.status(400).json({
            ok: false,
            err: 'Usuaio o contraseña incorrecta'
        });
    } else {
        if (!bcrypt.compareSync(body.password, profesor.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o contraseña incorrecta'
            });
        }

        let token = jwt.sign({
            profesor
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
            ok: true,
            profesor,
            token
        });
    }
});





module.exports = app;