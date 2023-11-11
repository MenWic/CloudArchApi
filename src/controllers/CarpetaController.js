const Carpeta = require('../models/Carpeta');
const Archivo = require('../models/Archivo');
const mongoose = require('mongoose');
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
    let respuesta = await eliminarCarpetaRecursiva(_body);
    res.json({
        respuesta: respuesta//si fue mal entonces devolver false
    });
    return;
}

const copiarCarpeta = async (req, res) => {
    const _body = req.body;
    _body.nombre = _body.nombre + "_copia";
    if (await verificarSiExisteOtraCarpetaConMismoNombre(_body)) {
        res.json({
            motivo: "Ya existe una carpeta con el mismo nombre",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
    let respuesta = await copiarRecursivo(_body, _body.carpeta_raiz_id);
    res.json({
        respuesta: respuesta//si fue mal entonces devolver false
    });
    return;
}

/**
 * Enviar _id del archivo a editar junto con carpeta_raiz_id con la ruta nueva

 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const moverCarpeta = async (req, res) => {
    const _body = req.body;
    //mandamos a traer la carpeta por su id
    const carpeta = await traerCarpetaPorIdFunc(_body._id);

    //si la carpeta no existe entonces lanzamos error
    if (!carpeta) {
        res.json({
            motivo: "La carpeta que intentas mover no existe",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }

    if (await verificarSiExisteOtraCarpetaConMismoNombre(carpeta)) {
        res.json({
            motivo: "Ya existe otra carpeta con el mismo nombre",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }


    if (_body._id === _body.destino_id) {
        res.json({
            motivo: "No puedes mover la carpeta hacia ella misma",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }

    //si la carpeta se esta moviendo hacia su misma direccion
    if (_body.destino_id === carpeta.carpeta_raiz_id) {
        res.json({
            motivo: "Estas intentando mover la carpeta al mismo lugar en la que se encuentra",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }

    //si la carpeta destino no es la raiz de lo contrario hacemos el cambio directo
    if (_body.destino_id !== "raiz") {

        //debemos verificar que la carpeta que se quiere mover no sea padre o ancestra de la carpeta destino
        //mandamos a traer la info de la carpeta destino
        let carpetaDestino = await traerCarpetaPorIdFunc(_body.destino_id)
        //si la destino no existe entonces 
        if (!carpetaDestino) {
            res.json({
                motivo: "La carpeta destino no existe.",
                respuesta: false//si fue mal entonces devolver false
            });
            return;
        }
        //mientras no se haya recorrido todo el padre
        while (true) {
            if (carpetaDestino._id.toString() === carpeta._id.toString()) {
                res.json({
                    motivo: "No puedes mover una carpeta padre hacia su hijo.",
                    respuesta: false//si fue mal entonces devolver false
                });
                return;
            } else {

                if (carpetaDestino.carpeta_raiz_id !== "raiz") {
                    carpetaDestino = await traerCarpetaPorIdFunc(carpetaDestino.carpeta_raiz_id);
                } else {
                    break;
                }

            }
        }

    }


    const update = await Carpeta.findByIdAndUpdate(
        {
            _id: _body._id
        },
        {
            carpeta_raiz_id: _body.destino_id
        }
    );

    if (update) {
        res.json({
            motivo: "Se movio la carpeta con exito.",
            respuesta: true//si fue mal entonces devolver false
        });
        return;
    } else {
        res.json({
            motivo: "No se movio la carpeta debido a un error inesperado",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
}



async function copiarRecursivo(carpeta, raiz) {
    try {

        //crear la carpeta nueva
        const newCarpta = new Carpeta({
            carpeta_raiz_id: raiz,
            nombre: carpeta.nombre,
            usuario_propietario: carpeta.usuario_propietario
        });

        //guardar la carpeta copia
        let save = await newCarpta.save();
        //traemos los archivos hijos de la carpta
        let archivosHijos = await Archivo.find({ carpeta_raiz_id: carpeta._id });
        //cada uno de los rachivos hijos copiarlos
        for (let archivos of archivosHijos) {

            //crear un nuevo Articulo a partir del archivo hijo
            const newArchivo = new Archivo({
                carpeta_raiz_id: save._id,
                nombre: archivos.nombre,
                extension: archivos.extension,
                contenido: archivos.contenido,
                usuario_propietario: archivos.usuario_propietario
            });

            //mandamos a guardar el nuevo Articulo
            const insert = await newArchivo.save();
        }

        let carpetasHijas = await Carpeta.find({ carpeta_raiz_id: carpeta._id });
        for (let carpetas of carpetasHijas) {
            await copiarRecursivo(carpetas, save._id);
        }
        return true;
    } catch (error) {
        return false; // Manejar el error según sea necesario
    }
}

async function eliminarCarpetaRecursiva(carpeta) {
    try {

        //traemos los archivos hijos de la carpta
        let archivosHijos = await Archivo.find({ carpeta_raiz_id: carpeta._id });
        //mandmaos a eliminar los archivos hijos
        for (let archivos of archivosHijos) {
            ArchivosController.eliminarArchivoFuntion(archivos, true);
        }

        //eliminamos la carpeta y la adjuntamos a la papelera de carpetas
        let eliminacionCarpteta = await Carpeta.deleteOne({ _id: carpeta._id });
        //creamos la nueva papelera de carpeta y la guardamos
        let papelera = new PapeleraCarpeta({
            _id: carpeta._id,
            carpeta_raiz_id: carpeta.carpeta_raiz_id,
            nombre: carpeta.nombre,
            usuario_propietario: carpeta.usuario_propietario
        });
        let insertPapelera = await papelera.save();

        let carpetasHijas = await Carpeta.find({ carpeta_raiz_id: carpeta._id });
        for (let carpetas of carpetasHijas) {
            await eliminarCarpetaRecursiva(carpetas);
        }
        return true;
    } catch (error) {
        return false; // Manejar el error según sea necesario
    }
}

/**
 * Busca la carpeta por el atributo id de la query
 * @param {*} req 
 * @param {*} res 
 */
const traerCarpetaPorId = async (req, res) => {
    const _body = req.query;
    const find = await traerCarpetaPorIdFunc(_body.id);
    if (find) {
        res.json(find);
    } else {
        res.send([{}]);
    }
}


const mostarCarpetasDeCarpeta = async (req, res) => {
    const _body = req.query;
    const find = await Carpeta.find(
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

const mostrarCarpetasDeUsuario = async (req, res) => {
    const _body = req.query;
    const find = await Carpeta.find(
        {
            usuario_propietario: _body.usuario_propietario
        }
    );
    if (find) {
        res.json(find);
    } else {
        res.send([{}]);
    }
}

const mostrarPathDeCarpeta = async (req, res) => {
    const _body = req.query;

    if (_body.id === "raiz") {
        res.json("raiz");
        return;
    }

    const find = await Carpeta.findOne(
        {
            _id: _body.id
        }
    );

    let path = await construirPath(find);

    res.json(path);

}


async function construirPath(carpeta) {
    let padre = carpeta;
    let path = "";

    if (padre.carpeta_raiz_id === "raiz") {
        path = padre.nombre;
    } else {
        path = path + padre.nombre;
        while (padre.carpeta_raiz_id !== "raiz") {
            padre = await Carpeta.findOne(
                { _id: padre.carpeta_raiz_id }
            );
            path = padre.nombre + "/" + path;
        }
    }

    return "raiz/" + path + "/";
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

async function traerCarpetaPorIdFunc(id) {
    const find = await Carpeta.findOne(
        {
            _id: id
        }
    );
    return find;
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
    mostarCarpetasDeCarpeta: mostarCarpetasDeCarpeta,
    copiarCarpeta: copiarCarpeta,
    moverCarpeta: moverCarpeta,
    mostrarCarpetasDeUsuario: mostrarCarpetasDeUsuario,
    traerCarpetaPorId: traerCarpetaPorId,
    mostrarPathDeCarpeta: mostrarPathDeCarpeta
}