const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const Alumno = require('../model/alumno');
const Padres = require('../model/padres');
const app = express();
const { verificaToken, verificaAdminRole, verificaSuperRole } = require('../middlewares/autenticacion');

//listar Alumnos
app.get('/alumnos', [verificaToken], (req, res) => {

    let limite = req.params.limit || 10;
    let pagina = req.param.pag || 0;
    let pag = limite * pagina;


    Alumno.find()
        .limit(limite)
        .skip(pag)
        .populate('padres')
        .then(alumnos => {

            if (!alumnos) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'No se ha n descargado lista de alumnos'
                    }
                });
            }

            res.json({
                ok: true,
                alumnos
            });

        }).catch(err => {
            return res.status(500).json({
                ok: false,
                error: err
            });
        });
});

//Crear alumno (En el caso de que sea menor de edad sera obligatorio el paso de los datos del padre por parametros, fecha de nacimietno obligatoria dd/mm/aaaa)
app.post('/alumno', [verificaToken], (req, res) => {
    let body = req.body;

    let annioActual = new Date().getFullYear();
    let fechaNacimiento = body.fechaNacimiento.split('/');
    let annioNacimiento = fechaNacimiento[fechaNacimiento.length - 1];

    // Verifico que el alumno sea mayor de edad, el el caso de no serlo creo el objeto padres y lo adjunto al alumno
    alumno = new Alumno({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        telefono: body.telefono,
        direccion: body.direccion,
        cp: body.cp,
        password: bcrypt.hashSync(body.password, 10),
        fechaNacimiento: body.fechaNacimiento
    });
    if ((annioActual - annioNacimiento) < 18) {
        padres = new Padres({
            nombrePadre: body.nombrePadre,
            ApellidosPadre: body.ApellidosPadre,
            emailPadre: body.emailPadre,
            telefonoPadre: body.telefonoPadre,
            direccionPadre: body.direccionPadre
        })

        padres.save().then(padre => {
            if (!padre) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'No se ha creado el objeto padres'
                    }
                });
            }
            alumno.padres = padre._id;
            alumno.save().then(alumnoDb => {
                if (!alumnoDb) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'No se ha creado el alumno'
                        }
                    });
                }

                res.json({
                    ok: true,
                    alumnoDb
                });

            }).catch(err => {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            });
        }).catch(err => {
            return res.status(500).json({
                ok: false,
                error: err
            });
        });
    } else {

        alumno.save().then(alumnoDb => {
            if (!alumnoDb) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'No se ha creado el alumno'
                    }
                });
            }

            res.json({
                ok: true,
                alumnoDb
            });

        }).catch(err => {
            return res.status(500).json({
                ok: false,
                error: err
            });
        });
    }

});

// Acualizar usuario, no esta permitido actualizar el padre, en el caso de que sea neceario crear función independiente
app.put('/alumno/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'apellidos', 'password', 'avatar', 'telefono', 'direccion', 'cp', 'password', 'formaPago', 'estado']);

    Alumno.findByIdAndUpdate(id, body, { new: true, runValidators: true }).then(alumno => {
        if (!alumno) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Alumno no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            alumno
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: 'a' + err
        });
    });
});

app.delete('/alumno/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Alumno.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }).then(alumnoDb => {
        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Alumno no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            alumno: alumnoDb
        });

    }).catch(err => {
        return res.status(500).json({
            ok: false,
            error: err
        });
    });
});

// Login de alumno (Posiblemente se centralice con un sw para determinar el tipo de login (Usuario, Alumno o Profesor))
app.post('/alumno/login', async(req, res) => {

    let body = req.body;
    let alumno = await Alumno.findOne({ email: body.email });

    if (!alumno) {
        return res.status(400).json({
            ok: false,
            err: 'Usuaio o contraseña incorrecta'
        });
    } else {
        if (!bcrypt.compareSync(body.password, alumno.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o contraseña incorrecta'
            });
        }

        let token = jwt.sign({
            alumno
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
            ok: true,
            alumno,
            token
        });
    }
});

module.exports = app;