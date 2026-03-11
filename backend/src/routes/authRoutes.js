const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // We'll make this next
const { isAdmin } = require('../middleware/roleCheck');

router.post('/login', authController.login);
router.post('/register', authController.registerCustomer);

// Only Admins can manage staff
router.post('/add-staff', protect, isAdmin, authController.addStaff);

router.get('/staff', protect, isAdmin, authController.getAllStaff);
router.put('/staff/:id', protect, isAdmin, authController.updateStaff);
router.delete('/staff/:id', protect, isAdmin, authController.deleteStaff);
module.exports = router;