const express = require('express');

const papelera = require("../controllers/PapeleraCarpetaController");

const router = express.Router();


router.get('/traerCarpetaPorId', papelera.traerCarpetaPorId);
router.get('/mostarCarpetasDeCarpeta', papelera.mostarCarpetasDeCarpeta);//definiendo rutas

module.exports = router;//exporar el routers