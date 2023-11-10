const Papelera = require('../models/Papelera');

/**
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const verPapelera = async (req, res) => {
    const papelera = await Papelera.find();

    if (papelera) {
        res.json(papelera);
        return;
    } else {
        res.json([]);
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
    const find = await Papelera.findOne(
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
module.exports = {
    verPapelera: verPapelera,
    traerArchivoPorId: traerArchivoPorId
}