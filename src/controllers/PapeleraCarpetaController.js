const PapeleraCarpeta = require('../models/PapeleraCarpeta');
/**
 * Busca la carpeta por el atributo id de la query
 * @param {*} req 
 * @param {*} res 
 */
const traerCarpetaPorId = async (req, res) => {
    const _body = req.query;
    const find = await PapeleraCarpeta.findOne(
        {
            _id: _body.id
        }
    );
    if (find) {
        res.json(find);
    } else {
        res.send([{}]);
    }
}


const mostarCarpetasDeCarpeta = async (req, res) => {
    const _body = req.query;
    const find = await PapeleraCarpeta.find(
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

module.exports = {
    mostarCarpetasDeCarpeta: mostarCarpetasDeCarpeta,
    traerCarpetaPorId: traerCarpetaPorId
}