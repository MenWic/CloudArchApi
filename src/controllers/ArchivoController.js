const Archivo = require('../models/Archivo');
const Papelera = require('../models/Papelera');
const Compartido = require('../models/Compartidos');
const UsuarioController = require('../controllers/UsuarioController');

const crearArchivo = async (req, res) => {
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


/**
 * COpia un archivo en el directorio enviado, le adjunta "_copia" al nombre del archivo
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const copiarArchivo = async (req, res) => {
    const _body = req.body;
    if (!verificarArchivo(_body)) {
        res.json({
            motivo: "No se copio el archivo puesto que hay informacion incompleta o extension erronea.",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }

    //crear un nuevo Articulo a partir del body
    const newArchivo = new Archivo({
        carpeta_raiz_id: _body.carpeta_raiz_id,
        nombre: _body.nombre + "_copia",
        extension: _body.extension,
        contenido: _body.contenido,
        usuario_propietario: _body.usuario_propietario
    });

    //mandamos a guardar el nuevo Articulo
    const insert = await newArchivo.save();

    if (insert) {
        res.json({
            motivo: "Se copio el archivo con exito.",
            respuesta: true//si fue mal entonces devolver false
        });
        return;
    } else {
        res.json({
            motivo: "No se copio el archivo debido a un error inesperado",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
}

const eliminarArchivo = async (req, res) => {
    const _body = req.body;
    if (!_body._id || _body._id === "") {
        res.json({
            motivo: "No se elimino el archivo puesto que hay el id esta incompleto.",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
    let jsonEliminacion = await eliminarArchivoFuntion(_body, false);
    res.json(jsonEliminacion);
}

async function eliminarArchivoFuntion(archivo, borrandoCarpeta) {
    const eliminacion = await Archivo.deleteOne(
        {
            _id: archivo._id
        }
    )



    //crear una nueva papelera a partir del body
    const newPapelera = new Papelera({
        _id: archivo._id,
        carpeta_raiz_id: archivo.carpeta_raiz_id,
        nombre: archivo.nombre,
        extension: archivo.extension,
        contenido: archivo.contenido,
        usuario_propietario: archivo.usuario_propietario
    });

    if (!borrandoCarpeta) {
        newPapelera.carpeta_raiz_id = "raiz"
    }

    const save_papelera = await newPapelera.save();

    if (eliminacion && save_papelera) {
        return {
            motivo: "Se elimino el archivo con exito.",
            respuesta: true//si fue mal entonces devolver false
        };
    } else {
        return {
            motivo: "No se elimino el archivo debido a un error inesperado",
            respuesta: false//si fue mal entonces devolver false
        };
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
            extension: _body.extension,
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

/**
 * Enviar _id del archivo a editar junto con carpeta_raiz_id con la ruta nueva

 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const moverArchivo = async (req, res) => {
    const _body = req.body;

    const archivo = await traerArchivoPorIdFunc(_body._id);;

    //si la carpeta no existe entonces lanzamos error
    if (!archivo) {
        res.json({
            motivo: "El archivo que intentas mover no existe",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }

    if (await verificarSiExisteOtroArchivoConMismoNombre(archivo)) {
        res.json({
            motivo: "Ya existe un archivo con el mismo nombre en el directorio.",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }


    const update = await Archivo.findByIdAndUpdate(
        {
            _id: _body._id
        },
        {
            carpeta_raiz_id: _body.destino_id
        });

    if (update) {
        res.json({
            motivo: "Se movio el archivo con exito.",
            respuesta: true//si fue mal entonces devolver false
        });
        return;
    } else {
        res.json({
            motivo: "No se movio el archivo debido a un error inesperado",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
}

/**
 * Busca una carpeta por el atributo id de la query
 * @param {*} req 
 * @param {*} res 
 */
const traerArchivoPorId = async (req, res) => {
    const _body = req.query;
    const find = await traerArchivoPorIdFunc(_body.id);
    if (find) {
        res.json(find);
    } else {
        res.send(null);
    }
}

async function traerArchivoPorIdFunc(id) {
    const find = await Archivo.findOne(
        {
            _id: id
        }
    );
    return find;
}


const mostarArchivosDeCarpeta = async (req, res) => {
    const _body = req.query;
    const find = await Archivo.find(
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
    crearArchivo: crearArchivo,
    editarArchivo: editarArchivo,
    copiarArchivo: copiarArchivo,
    eliminarArchivo: eliminarArchivo,
    mostarArchivosDeCarpeta: mostarArchivosDeCarpeta,
    moverArchivo: moverArchivo,
    eliminarArchivoFuntion: eliminarArchivoFuntion,
    traerArchivoPorId: traerArchivoPorId
}