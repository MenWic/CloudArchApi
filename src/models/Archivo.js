const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model;

const ArchivoSchema = new Schema(
    {
        carpeta_raiz_id: String,
        nombre: String,
        extension: String,
        contenido: String,
        usuario_propietario: String
    }
);

module.exports = model('archivos', ArchivoSchema);