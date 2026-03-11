const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Public route for customers to place orders directly
router.post('/public', orderController.createOrder);
router.get('/public/:id', orderController.getOrderById);

// Both Admin and Staff can create/view orders
router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/', protect, orderController.getOrders);

// Status updates for kitchen staff
router.put('/:id/status', protect, orderController.updateStatus);

module.exports = router;