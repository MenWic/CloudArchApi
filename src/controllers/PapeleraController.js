const Papelera = require('../models/Papelera');

const mostarArchivosDeCarpeta = async (req, res) => {
    const _body = req.query;
    const find = await Papelera.find(
        {
            carpeta_raiz_id: _body._id,
        }
    );

    if (find) {
        res.json(find);
    } else {
        res.send([{}]);
    }
}

/**
 * Busca una carpeta por el atributo id de la query
 * @param {*} req 
 * @param {*} res 
 */
const traerArchivoPorId = async (req, res) => {
    const _body = req.query;
    try {
        const find = await Papelera.findOne(
            {
                _id: _body.id,
            }
        );

        if (find) {
            res.json(find);
        } else {
            res.send({});
        }
    } catch (error) {
    }

}

module.exports = {
    mostarArchivosDeCarpeta: mostarArchivosDeCarpeta,
    traerArchivoPorId: traerArchivoPorId
}