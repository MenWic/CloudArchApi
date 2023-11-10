const express = require('express');

const papeleraController = require("../controllers/PapeleraController");

const router = express.Router();

router.get('/verPapelera', papeleraController.verPapelera);
router.get('/traerArchivoPorId', papeleraController.traerArchivoPorId);
module.exports = router;//exporar el routers