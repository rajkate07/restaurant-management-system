const User = require('./User');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const { sequelize } = require('../config/db'); // ✅ Destructure the instance
const { DataTypes } = require('sequelize');

// Relationship 1: User -> Order (One-to-Many)
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

/** * Relationship 2: Order <-> MenuItem (Many-to-Many)
 * We need a 'Join Table' called OrderItems to store 
 * how many of each item were ordered.
 */
const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

Order.belongsToMany(MenuItem, { through: OrderItem });
MenuItem.belongsToMany(Order, { through: OrderItem });

module.exports = {
  User,
  MenuItem,
  Order,
  OrderItem,
  sequelize
};