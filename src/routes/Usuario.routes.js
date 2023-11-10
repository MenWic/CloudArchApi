const express = require('express');

const usuarioController = require("../controllers/UsuarioController");

const router = express.Router();

router.post('/login', usuarioController.login);//definiendo rutas
router.post('/crearUsuario', usuarioController.crearUsuario);//definiendo rutas
router.get('/buscarUsuarioPorNombre', usuarioController.buscarUsuarioPorNombre)
module.exports = router;//exporar el routers