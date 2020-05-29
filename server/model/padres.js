const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let padresSchema = new Schema({

    nombrePadre: {
        type: String,
        required: [true, 'El campo nomre es necesario']
    },
    ApellidosPadre: {
        type: String,
        required: [true, 'El campo apellido es necesario']
    },
    emailPadre: {
        type: String,
        unique: true,
        required: [true, 'El campo email es necesario']
    },
    telefonoPadre: {
        type: String,
        unique: true,
        required: [true, 'El campo teléfono es necesario']
    },
    direccionPadre: {
        type: String
    }

})

module.exports = mongoose.model('Padres', padresSchema);