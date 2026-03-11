const MenuService = require('../services/menuService');

exports.getMenu = async (req, res) => {
  try {
    const items = await MenuService.getAllItems();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const newItem = await MenuService.addItem(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuService.updateItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuService.removeItem(req.params.id);
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};