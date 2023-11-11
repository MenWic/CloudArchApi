const Compartido = require('../models/Compartidos');
const UsuarioController = require('../controllers/UsuarioController');

const compartirArchivo = async (req, res) => {
    const _body = req.body;

    //verificamos que el usuario existe
    if (!await UsuarioController.existeUsuario(_body.usuario_receptor)) {
        res.json({
            motivo: "El usuario receptor no existe.",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
    //crear un nuevo Articulo a partir del body
    const newCompartido = new Compartido({
        nombre: _body.nombre,
        extension: _body.extension,
        contenido: _body.contenido,
        usuario_que_compartio: _body.usuario_que_compartio,
        usuario_receptor: _body.usuario_receptor
    });

    //mandamos a guardar el nuevo Articulo
    const insert = await newCompartido.save();

    if (insert) {
        res.json({
            motivo: "Se compartio el archivo con exito.",
            respuesta: true//si fue mal entonces devolver false
        });
        return;
    } else {
        res.json({
            motivo: "No se compartio el archivo debido a un error inesperado",
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
}


/**
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const verCompartidosDeUsuario = async (req, res) => {
    
    const _body = req.query;

    const compartidosDeUsuario = await Compartido.find(
        {
            usuario_receptor: _body.usuario
        }
    );
    if (compartidosDeUsuario) {
        res.json(compartidosDeUsuario);
        return;
    } else {
        res.json([]);
        return;
    }
}

/**
 * Busca un archivo por el atributo id de la query
 * @param {*} req 
 * @param {*} res 
 */
const traerCompartidoPorId = async (req, res) => {
    const _body = req.query;
    const find = await Compartido.findOne(
        {
            _id: _body.id,
        }
    );

    if (find) {
        res.json(find);
    } else {
        res.send([{}]);
    }
}

const eliminarDeCompartidos = async (req, res) => {
    const _body = req.body;
    const eliminacion = await Compartido.deleteOne(
        {
            _id: _body._id
        }
    )

    if (eliminacion) {
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

module.exports = {
    compartirArchivo:compartirArchivo,
    verCompartidosDeUsuario: verCompartidosDeUsuario,
    traerCompartidoPorId: traerCompartidoPorId,
    eliminarDeCompartidos:eliminarDeCompartidos
}
