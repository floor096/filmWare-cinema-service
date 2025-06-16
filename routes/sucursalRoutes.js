const express = require('express');
const router = express.Router();
const { crearSucursal, obtenerSucursales } = require('../controllers/sucursalController');
const { verificarToken } = require('../middlewares/verificarToken');

router.post('/', verificarToken, crearSucursal);
router.get('/', verificarToken, obtenerSucursales);

module.exports = router;
