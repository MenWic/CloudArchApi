const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model;

const PapeleraSchema = new Schema(
    {
        carpeta_raiz_id: String,
        nombre: String,
        extension: String,
        contenido: String,
        usuario_propietario: String
    }
);

module.exports = model('papeleras', PapeleraSchema);