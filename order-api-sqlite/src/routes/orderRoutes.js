const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');


router.post('/', ctrl.createOrder);
router.get('/list', ctrl.listOrders);
router.get('/:orderId', ctrl.getOrder);
router.put('/:orderId', ctrl.updateOrder);
router.delete('/:orderId', ctrl.deleteOrder);


module.exports = router;