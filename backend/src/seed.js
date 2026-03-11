const { sequelize } = require('./config/db');
const { User, MenuItem } = require('./models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync and clear tables if necessary
    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    // 1. Create Default Admin
    const adminEmail = 'admin@restaurant.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'admin123', // Model hook will hash this
        role: 'admin',
        active: true
      });
      console.log('✅ Default Admin created: admin@restaurant.com / admin123');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // 2. Create Initial Menu Items if none exist
    const itemCount = await MenuItem.count();
    if (itemCount === 0) {
      const initialMenuItems = [
        { name: 'Spring Rolls', price: 180, category: 'Starters', available: true },
        { name: 'Tomato Soup', price: 150, category: 'Starters', available: true },
        { name: 'Paneer Tikka', price: 220, category: 'Starters', available: true },
        { name: 'Butter Chicken', price: 350, category: 'Main Course', available: true },
        { name: 'Paneer Butter Masala', price: 280, category: 'Main Course', available: true },
        { name: 'Veg Biryani', price: 250, category: 'Main Course', available: true },
        { name: 'Fresh Lime Soda', price: 80, category: 'Beverages', available: true },
        { name: 'Gulab Jamun', price: 150, category: 'Desserts', available: true },
        { name: 'Butter Naan', price: 60, category: 'Breads', available: true },
        { name: 'Jeera Rice', price: 180, category: 'Rice', available: true }
      ];

      await MenuItem.bulkCreate(initialMenuItems);
      console.log('✅ Initial menu items seeded.');
    }

    console.log('🚀 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();