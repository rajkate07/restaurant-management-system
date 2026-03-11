const { Order, MenuItem, OrderItem, sequelize } = require('../models');

class OrderService {
  async createOrder(orderData, user) {
    const { tableNumber, items, paymentMethod, transactionId } = orderData;

    // Start a Transaction (if one part fails, nothing is saved to DB)
    const t = await sequelize.transaction();

    try {
      let subtotal = 0;
      const processedItems = [];

      // 1. Calculate totals using DB prices
      for (const item of items) {
        const menuItem = await MenuItem.findByPk(item.menuItemId);
        if (!menuItem) throw new Error(`Item ${item.menuItemId} not found`);

        subtotal += Number(menuItem.price) * item.quantity;
        processedItems.push({
          MenuItemId: menuItem.id,
          quantity: item.quantity
        });
      }

      // 2. Tax Logic
      const cgst = subtotal * 0.025; // 2.5%
      const sgst = subtotal * 0.025; // 2.5%
      const total = subtotal + cgst + sgst;

      // 3. Create the Order record
      const order = await Order.create({
        id: `ORD-${Date.now().toString().slice(-6)}`,
        tableNumber,
        subtotal,
        cgst,
        sgst,
        total,
        paymentMethod,
        transactionId,
        staffName: orderData.customerName || (user ? user.name : 'Customer'),
        userId: user ? user.id : null
      }, { transaction: t });

      // 4. Link items to the order in the Join Table (OrderItem)
      for (const pItem of processedItems) {
        await order.addMenuItem(pItem.MenuItemId, {
          through: { quantity: pItem.quantity },
          transaction: t
        });
      }

      await t.commit();
      const finalOrder = await Order.findByPk(order.id, {
        include: [{ model: MenuItem }]
      });
      return this.mapOrder(finalOrder);
    } catch (error) {
      if (t) await t.rollback();
      throw error;
    }
  }

  async getAllOrders() {
    const orders = await Order.findAll({ include: [MenuItem], order: [['createdAt', 'DESC']] });
    return orders.map(o => this.mapOrder(o));
  }

  async getOrdersByUser(userId) {
    const orders = await Order.findAll({
      where: { userId },
      include: [MenuItem],
      order: [['createdAt', 'DESC']]
    });
    return orders.map(o => this.mapOrder(o));
  }

  async getOrderById(orderId) {
    const order = await Order.findByPk(orderId, { include: [MenuItem] });
    return order ? this.mapOrder(order) : null;
  }

  // Helper to map Sequelize structure to Frontend Interface
  mapOrder(order) {
    const raw = (typeof order.get === 'function') ? order.get({ plain: true }) : order;
    return {
      ...raw,
      items: (raw.MenuItems || []).map(mi => ({
        menuItem: {
          id: mi.id,
          name: mi.name,
          price: mi.price,
          category: mi.category,
          available: mi.available
        },
        quantity: mi.OrderItem ? mi.OrderItem.quantity : 1
      }))
    };
  }

  async updateOrderStatus(orderId, statusData) {
    const { status, estimatedTime } = statusData;
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error('Order not found');

    const updates = { status };
    if (status === 'preparing') {
      updates.estimatedTime = estimatedTime || 30; // Default 30 mins
      updates.startTime = new Date();
    }

    return await order.update(updates);
  }
}

module.exports = new OrderService();