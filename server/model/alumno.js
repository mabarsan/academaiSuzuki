const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let formaPago = {
    values: ['MENSUAL', 'TRIMESTRAL', 'TOTAL'],
    message: '{VALUE} no es un rol valido'
}


let alumnoSchema = new Schema({
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
    password: {
        type: String,
        required: true
    },
    formaPago: {
        type: String,
        required: true,
        default: 'MENSUAL',
        enum: formaPago
    },
    /*calendario: {
        type: Schema.Types.ObjectId, //El calendario del alumno está asociado a cursos -- RESOLVER
        ref: "Calendario"
    },
    logros: {
        type: [Schema.Types.ObjectId],
        ref: "Logro"
            // Los logros pueden ser definidos por cada centro (Nombre, descripción)
    },
    cursos: {
        type: [Schema.Types.ObjectId],
        ref: "Curso"
    },*/
    fechaNacimiento: {
        type: String,
        required: true
    },
    padres: {
        type: Schema.Types.ObjectId,
        ref: "Padres"
    },
    estado: {
        type: Boolean,
        default: true
    }
});

//Eliminamos la pass de la respuesta JSON de usuario por seguridad
alumnoSchema.methods.toJSON = function() {
    let alumno = this;
    let alumnosObject = alumno.toObject();
    delete alumnosObject.password;

    return alumnosObject;
};

module.exports = mongoose.model('Alumno', alumnoSchema);