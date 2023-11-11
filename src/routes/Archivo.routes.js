const express = require('express');

const archivoController = require("../controllers/ArchivoController");

const router = express.Router();

router.post('/crearArchivo', archivoController.crearArchivo);//definiendo rutas
router.put('/editarArchivo', archivoController.editarArchivo);//definiendo rutas
router.post('/copiarArchivo', archivoController.copiarArchivo);//definiendo rutas
router.post('/moverArchivo', archivoController.moverArchivo);//definiendo rutas
router.post('/eliminarArchivo', archivoController.eliminarArchivo);//definiendo rutas
router.get('/mostarArchivosDeCarpeta', archivoController.mostarArchivosDeCarpeta);//definiendo rutas

module.exports = router;//exporar el routers