const Carpeta = require('../models/Carpeta');

const crearCarpeta = async (req, res) => {
    const _body = req.body;
    if (!verificarArchivo(_body)) {
        res.json({
            motivo: "No se guardo el archivo puesto que hay informacion incompleta o extension erronea.",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }

    if (await verificarSiExisteOtroArchivoConMismoNombre(_body)) {
        res.json({
            motivo: "Ya existe un archivo con el mismo nombre",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }

    //crear un nuevo Articulo a partir del body
    const newArchivo = new Archivo({
        carpeta_raiz_id: _body.carpeta_raiz_id,
        nombre: _body.nombre,
        extension: _body.extension,
        contenido: _body.contenido,
        usuario_propietario: _body.usuario_propietario
    });

    //mandamos a guardar el nuevo Articulo
    const insert = await newArchivo.save();

    if (insert) {
        res.json({
            motivo: "Se guardo el archivo con exito.",
            respuesta: true//si fue mal entonces devolver false
        });
        return;
    } else {
        res.json({
            motivo: "No se inserto el archivo debido a un error inesperado",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
}


const editarArchivo = async (req, res) => {
    const _body = req.body;
    if (!verificarArchivo(_body)) {
        res.json({
            motivo: "No se edito el archivo puesto que hay informacion incompleta o extension erronea.",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }

    if (await verificarSiExisteOtroArchivoConMismoNombre(_body)) {
        res.json({
            motivo: "Ya existe un archivo con el mismo nombre",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }


    const update = await Archivo.findByIdAndUpdate(
        {
            _id: _body._id
        },
        {
            nombre: _body.nombre,
            contenido: _body.contenido,
        });

    if (update) {
        res.json({
            motivo: "Se edito el archivo con exito.",
            respuesta: true//si fue mal entonces devolver false
        });
        return;
    } else {
        res.json({
            motivo: "No se edito el archivo debido a un error inesperado",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
}



async function verificarSiExisteOtroArchivoConMismoNombre(archivo) {
    try {
        let archivoRepetido = null;

        if (archivo._id) {
            archivoRepetido = await Archivo.findOne({
                
                carpeta_raiz_id: archivo.carpeta_raiz_id,
                nombre: archivo.nombre,
                _id: { $ne: archivo._id } // Asegura que el _id sea diferente
            });
        } else {
            archivoRepetido = await Archivo.findOne({
                carpeta_raiz_id: archivo.carpeta_raiz_id,
                nombre: archivo.nombre
            });
        }



        if (archivoRepetido) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false; // Manejar el error según sea necesario
    }
}

function verificarArchivo(archivo) {
    if (!archivo || !archivo.nombre || archivo.nombre === "" ||
        !archivo.extension || archivo.extension === "" ||
        !archivo.contenido ||
        !archivo.usuario_propietario || archivo.usuario_propietario === ""
    ) {
        return false;
    }

    if (archivo.extension !== ".txt" && archivo.extension !== ".html") {
        return false;
    }

    return true;
}


module.exports = {
    crearCarpeta: crearCarpeta,
}