const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleCheck');

// GET /api/menu
router.get('/', menuController.getMenu);

// POST /api/menu (Protected)
router.post('/', protect, isAdmin, menuController.addMenuItem);

// PUT /api/menu/:id
router.put('/:id', protect, isAdmin, menuController.updateMenuItem);

// DELETE /api/menu/:id
router.delete('/:id', protect, isAdmin, menuController.deleteMenuItem);
module.exports = router;