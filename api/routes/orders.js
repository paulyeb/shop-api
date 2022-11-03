const express = require('express');
const router = express.Router();


const OrdersController = require('../controllers/orders');

router.get('/', OrdersController.index);

router.post('/', OrdersController.create)

router.get('/:orderId', OrdersController.show)

router.delete('/:orderId', OrdersController.delete)

module.exports = router;