const express = require('express');
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.obtenerPedidos);
router.get('/:id', pedidoController.obtenerPedidoPorId);
router.post('/', pedidoController.crearPedido);
router.put('/:id', pedidoController.actualizarPedido);
router.delete('/:id', pedidoController.eliminarPedido);

module.exports = router;