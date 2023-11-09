const express = require('express');

const carpetaController = require("../controllers/CarpetaController");

const router = express.Router();

router.post('/crearCarpeta', carpetaController.crearCarpeta);//definiendo rutas
router.post('/eliminarCarpeta', carpetaController.eliminarCarpeta);//definiendo rutas
router.post('/copiarCarpeta', carpetaController.copiarCarpeta);
router.get('/mostarCarpetasDeCarpeta', carpetaController.mostarCarpetasDeCarpeta);//definiendo rutas
module.exports = router;//exporar el routers