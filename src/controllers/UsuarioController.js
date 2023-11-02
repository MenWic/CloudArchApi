const Usuario = require('../models/Usuario');
const createHash = require('crypto');

const login = async (req, res) => {
    //vemos si los parametros son nulos
    if (req.body.correoElectronico == null
        || req.body.password == null
        || req.body.correoElectronico == ""
        || req.body.password == "") {
        res.json({
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
    //seteamos la contra como una encriptada
    req.body.password = createHash.createHash('sha256').update(req.body.password).digest('hex');
    //mandamos a buscar el usuario por su password y su usuario
    const usuarioEncontrado = await Usuario.findOne(
        { correoElectronico: req.body.correoElectronico, password: req.body.password }
        );
    if (usuarioEncontrado) {
        res.json({ usuarioEncontrado });
    } else {
        res.send(null);
    }
}

module.exports = {
    login: login,
}