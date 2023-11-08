const Carpeta = require('../models/Carpeta');
const Archivo = require('../models/Archivo');
const PapeleraCarpeta = require('../models/PapeleraCarpeta');
const ArchivosController = require('../controllers/ArchivoController')
const crearCarpeta = async (req, res) => {
    const _body = req.body;
    if (!verificarCarpeta(_body)) {
        res.json({
            motivo: "No se guardo la carpeta puesto que hay informacion incompleta.",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
    if (await verificarSiExisteOtraCarpetaConMismoNombre(_body)) {
        res.json({
            motivo: "Ya existe una carpeta con el mismo nombre",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
    //crear un nuevo Articulo a partir del body
    const newCarpta = new Carpeta({
        carpeta_raiz_id: _body.carpeta_raiz_id,
        nombre: _body.nombre,
        usuario_propietario: _body.usuario_propietario
    });
    //mandamos a guardar el nuevo Articulo
    const insert = await newCarpta.save();
    if (insert) {
        res.json({
            motivo: "Se guardo la carpeta con exito.",
            respuesta: true//si fue mal entonces devolver false
        });
        return;
    } else {
        res.json({
            motivo: "No se inserto la carpeta debido a un error inesperado",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
}

const eliminarCarpeta = async (req, res) => {
    const _body = req.body;
    console.log(_body);
    let respuesta = await eliminarCarpetaRecursiva(_body);
    res.json({
        respuesta: respuesta//si fue mal entonces devolver false
    });
    return;
}

async function eliminarCarpetaRecursiva(carpeta) {

    try {

        //traemos los archivos hijos de la carpta
        let archivosHijos = await Archivo.find({ carpeta_raiz_id: carpeta._id });
        //mandmaos a eliminar los archivos hijos
        for (let archivos of archivosHijos) {
            ArchivosController.eliminarArchivoFuntion(archivos);
        }
        //eliminamos la carpeta y la adjuntamos a la papelera de carpetas
        let eliminacionCarpteta = await Carpeta.deleteOne({ _id: carpeta._id });
        //creamos la nueva papelera de carpeta y la guardamos
        let papelera = new PapeleraCarpeta({
            carpeta_raiz_id: carpeta.carpeta_raiz_id,
            nombre: carpeta.nombre,
            usuario_propietario: carpeta.usuario_propietario
        });
        let insertPapelera = await papelera.save();

        let carpetasHijas = await Carpeta.find({ carpeta_raiz_id: carpeta._id });
        for (let carpetas of carpetasHijas) {
            return await eliminarCarpetaRecursiva(carpetas);
        }
        return true;
    } catch (error) {
        console.error(error);
        return false; // Manejar el error según sea necesario
    }
}


const mostarCarpetasDeCarpeta = async (req, res) => {
    const _body = req.query;
    const find = await Carpeta.findOne(
        {
            carpeta_raiz_id: _body._id,
            usuario_propietario: _body.usuario_propietario
        }
    );
    if (find) {
        res.json(find);
    } else {
        res.send([{}]);
    }
}

async function verificarSiExisteOtraCarpetaConMismoNombre(carpeta) {

    try {
        let carpetaRepetida = null;

        if (carpeta._id) {
            carpetaRepetida = await Carpeta.findOne({

                carpeta_raiz_id: carpeta.carpeta_raiz_id,
                nombre: carpeta.nombre,
                _id: { $ne: carpeta._id } // Asegura que el _id sea diferente
            });
        } else {
            carpetaRepetida = await Archivo.findOne({
                carpeta_raiz_id: carpeta.carpeta_raiz_id,
                nombre: carpeta.nombre
            });
        }
        if (carpetaRepetida) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false; // Manejar el error según sea necesario
    }
}

function verificarCarpeta(archivo) {
    if (!archivo ||
        !archivo.nombre || archivo.nombre === "" ||
        !archivo.usuario_propietario || archivo.usuario_propietario === ""
    ) {
        return false;
    }
    return true;
}


module.exports = {
    crearCarpeta: crearCarpeta,
    eliminarCarpeta: eliminarCarpeta,
    mostarCarpetasDeCarpeta: mostarCarpetasDeCarpeta
}