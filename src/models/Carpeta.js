const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model;

const CarpetaSchema = new Schema(
    {
        carpeta_raiz_id: mongoose.Types.ObjectId,
        nombre: String,
        usuario_propietario: String
    }
);

module.exports = model('carpetas', CarpetaSchema);