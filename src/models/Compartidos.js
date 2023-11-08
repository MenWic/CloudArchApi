const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model;
const moment = require('moment');

const CompartidosSchema = new Schema(
    {
        nombre: String,
        extension: String,
        contenido: String,
        usuario_que_compartio: String,
        usuario_receptor: String,
        fecha_compartido: {type:String, default: moment().format("YYYY-MM-DD")},
    }
);

module.exports = model('compartidos', CompartidosSchema);