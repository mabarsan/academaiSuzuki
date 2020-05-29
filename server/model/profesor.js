const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let profesorSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El campo nombre es necesario'],
    },
    apellidos: {
        type: String,
        required: [true, 'El campo apellido es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El campo email es necesario']
    },
    telefono: {
        type: String, // preparar PIPE
        required: [true, 'El campo teléfono es necesario']
    },
    direccion: {
        type: String,
    },
    cp: {
        type: Number
    },
    avatar: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true
    },
    /*contrato: {
        type: Schema.Types.ObjectId,
        ref: "Contrato",
        required: true
    },
    calendario: {
        type: Schema.Types.ObjectId,
        ref: "Calendario"
            // Autogenerado al crear el profesor ( se crea limpio)
    },
    alumnos: {
        type: [Schema.Types.ObjectId],
        ref: "Alumno"
    },
    cursos: {
        type: [Schema.Types.ObjectId],
        ref: "Curso"
    }*/

});

//Eliminamos la pass de la respuesta JSON de usuario por seguridad
profesorSchema.methods.toJSON = function() {
    let profe = this;
    let profeObjet = profe.toObject();
    delete profeObjet.password;

    return profeObjet;
};

module.exports = mongoose.model('Profesor', profesorSchema);