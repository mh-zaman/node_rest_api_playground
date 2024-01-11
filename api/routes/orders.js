const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check_auth');

const orderController = require('../controllers/orders');


router.get('/', checkAuth, orderController.get_all_orders);

router.get('/:orderId', checkAuth, orderController.get_an_order);

router.post('/', checkAuth, orderController.create_order);

router.delete('/:orderId', checkAuth, orderController.delete_order);

module.exports = router;