const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model;

const PapeleraCarpetaSchema = new Schema(
    {
        carpeta_raiz_id: String,
        nombre: String,
        usuario_propietario: String
    }
);

module.exports = model('papelera_carpetas', PapeleraCarpetaSchema);