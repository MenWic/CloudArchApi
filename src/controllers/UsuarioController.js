const Usuario = require('../models/Usuario');
const createHash = require('crypto');

const login = async (req, res) => {

    if (!verificarUsuario(req.body.correoElectronico, req.body.password)) {
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

const crearUsuario = async (req, res) => {
    //vemos si los parametros son nulos
    if (!verificarUsuario(req.body.correoElectronico, req.body.password)) {
        res.json({
            respuesta: false//si fue mal entonces devolver false
        });
        return;
    }
    req.body.password = createHash.createHash('sha256').update(req.body.password).digest('hex');//seteamos la contra como una encriptada
    try {
        const insercion = await Usuario.insertMany(req.body);//mandamos a guardar al usuario en la db
        if (insercion) {//si todo fue bien tonces revolvemos true
            res.json({
                respuesta: true
            });
        } else {
            res.json({
                respuesta: false//si fue mal entonces devolver false
            });
        }
    } catch (MongoBulkWriteError) {
        res.json({
            respuesta: false//si fue mal entonces devolver false
        });
    }
}

function verificarUsuario(correoElectronico, password) {
    if (correoElectronico == null
        || password == null
        || correoElectronico == ""
        || password == "") {
        return false;
    }
    return true;
}

module.exports = {
    login: login,
    crearUsuario: crearUsuario,
}