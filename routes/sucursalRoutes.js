const express = require('express');
const router = express.Router();
const { crearSucursal, obtenerSucursales, actualizarSucursal, eliminarSucursal } = require('../controllers/sucursalController');

const { verificarToken } = require('../middlewares/verificarToken');

router.post('/', verificarToken, crearSucursal);
router.get('/', verificarToken, obtenerSucursales);
router.put('/:id', verificarToken, actualizarSucursal);
router.delete('/:id', verificarToken, eliminarSucursal);

module.exports = router;
