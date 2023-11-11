const express = require('express');

const carpetaController = require("../controllers/CarpetaController");

const router = express.Router();

router.post('/crearCarpeta', carpetaController.crearCarpeta);//definiendo rutas
router.post('/eliminarCarpeta', carpetaController.eliminarCarpeta);//definiendo rutas
router.post('/copiarCarpeta', carpetaController.copiarCarpeta);
router.post('/moverCarpeta', carpetaController.moverCarpeta);
router.get('/mostrarCarpetasDeUsuario', carpetaController.mostrarCarpetasDeUsuario);
router.get('/traerCarpetaPorId', carpetaController.traerCarpetaPorId);
router.get('/mostarCarpetasDeCarpeta', carpetaController.mostarCarpetasDeCarpeta);//definiendo rutas
router.get('/mostrarPathDeCarpeta', carpetaController.mostrarPathDeCarpeta);

module.exports = router;//exporar el routers