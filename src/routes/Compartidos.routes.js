const express = require('express');

const compartidosController = require("../controllers/CompartidoController");

const router = express.Router();

router.delete('/eliminarDeCompartidos', compartidosController.eliminarDeCompartidos);//definiendo rutas
router.get('/verCompartidosDeUsuario', compartidosController.verCompartidosDeUsuario);
router.get('/traerCompartidoPorId', compartidosController.traerCompartidoPorId);//definiendo rutas
module.exports = router;//exporar el routers