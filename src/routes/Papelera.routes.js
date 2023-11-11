const express = require('express');

const papeleraController = require("../controllers/PapeleraController");

const router = express.Router();

router.get('/mostarArchivosDeCarpeta', papeleraController.mostarArchivosDeCarpeta);
router.get('/traerArchivoPorId', papeleraController.traerArchivoPorId);
module.exports = router;//exporar el routers