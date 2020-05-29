const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userRole = {
    values: ['USER_ROLE', 'SUPER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son necesarios']
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: userRole
    },
    email: {
        type: String,
        require: [true, 'El email es neceario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    avatar: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    }
});

//Eliminamos la pass de la respuesta JSON de usuario por seguridad
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObjet = user.toObject();
    delete userObjet.password;

    return userObjet;
};


module.exports = mongoose.model('Usuario', usuarioSchema);