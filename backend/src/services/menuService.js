const { MenuItem } = require('../models');

class MenuService {
  async getAllItems() {
    return await MenuItem.findAll();
  }

  async addItem(itemData) {
    return await MenuItem.create(itemData);
  }

  async updateItem(id, updateData) {
    const item = await MenuItem.findByPk(id);
    if (!item) throw new Error('Menu item not found');
    return await item.update(updateData);
  }

  async removeItem(id) {
    const item = await MenuItem.findByPk(id);
    if (!item) throw new Error('Menu item not found');
    await item.destroy();
    return true;
  }
}

module.exports = new MenuService();