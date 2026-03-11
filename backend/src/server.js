// const { sequelize, initializeDatabase } = require('./config/db');
// const { User, MenuItem, Order } = require('./models'); // Ensure models are loaded

// const startServer = async () => {
//   try {
//     // 1. Ensure the Database exists in MySQL
//     await initializeDatabase();
//     console.log('✅ Database checked/created.');

//     // 2. Authenticate Sequelize
//     await sequelize.authenticate();

//     // 3. Sync Tables (creates the tables if they don't exist)
//     await sequelize.sync({ alter: true });
//     console.log('✅ Tables synchronized.');

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('❌ Startup failed:', error);
//   }
// };

// startServer();


const express = require('express'); // 1. Import Express
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');

const orderRoutes = require("./routes/orderRoutes")
// 2. Import Database logic
const { sequelize, initializeDatabase } = require('./config/db');
// Import models to ensure associations are loaded
require('./models');

const app = express(); // 3. INITIALIZE APP HERE (Fixes the ReferenceError)
const PORT = process.env.PORT || 5000;

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Basic Health Check Route
app.get('/', (req, res) => {
  res.send('Restaurant Billing System API is Live.');
});

// 6. The Startup Sequence
const startServer = async () => {
  try {
    // A. Create DB if it doesn't exist
    await initializeDatabase();
    console.log('✅ Database checked/created.');

    // B. Authenticate Sequelize connection
    await sequelize.authenticate();

    // C. Sync Tables
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronized.');

    // D. Now start listening for React requests
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // auth route
    app.use('/api/auth', authRoutes); // Connect the auth routes

    // menu route
    app.use('/api/menu', menuRoutes);

    // order route

    app.use('/api/orders', orderRoutes);

  } catch (error) {
    console.error('❌ Startup failed:', error);
  }
};

startServer();