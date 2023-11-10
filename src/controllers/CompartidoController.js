const Compartidos = require('../models/Papelera');

/**
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const verCompartidosDeUsuario = async (req, res) => {
    
    const _body = req.query;

    const compartidosDeUsuario = await Compartidos.find(
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
    const find = await Compartidos.findOne(
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
    const eliminacion = await Compartidos.deleteOne(
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
    verCompartidosDeUsuario: verCompartidosDeUsuario,
    traerCompartidoPorId: traerCompartidoPorId,
    eliminarDeCompartidos:eliminarDeCompartidos
}
