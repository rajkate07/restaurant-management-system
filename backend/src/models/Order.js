const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // ✅ Destructure the instance

/**
 * Order Model
 * Represents a completed transaction/bill.
 */
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    // We will generate custom IDs like 'ORD-0001' in the Service layer
  },
  tableNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cgst: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sgst: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'online'),
    allowNull: false,
  },
  staffName: {
    type: DataTypes.STRING, // Snapshot of the staff member's name at time of order
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // Store in minutes
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Order;