const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model;

const UsuarioSchema = new Schema(

    {
        correoElectronico: String,
        password: String,
        rol: String,
    }
);

module.exports = model('usuarios', UsuarioSchema);